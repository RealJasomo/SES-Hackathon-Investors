import React, { useState, useEffect, createContext } from 'react';
import firebase from '@fire';


interface IAuthenticationState{
    user: firebase.User | null,
    loaded: boolean,
}

const defaultAuthState: IAuthenticationState = {
    user: null,
    loaded: false,
};

export const AuthenticationContext: React.Context<IAuthenticationState> = createContext<IAuthenticationState>(defaultAuthState);

export default function AuthenticationProvider({ children }: {children: React.ReactNode}){
    const [authState, setAuthState] = useState<IAuthenticationState>(defaultAuthState);
    
    useEffect(() => {
        return firebase.auth().onAuthStateChanged(user => {
            setAuthState({
                user,
                loaded: true
            });
        });
    }, [])

    return (
        <AuthenticationContext.Provider value={authState}>
            {children}
        </AuthenticationContext.Provider>);
}