import React, { useContext } from 'react';
import { AuthenticationContext } from '@contexts/AuthContext';
import { Redirect } from 'react-router';

export default function withAuthentication<T>(Component: React.ComponentType<T>, redirectUrl: string = '/', redirectAuthenticated: boolean = false){
    return function WrappedComponent(props: T){
        const auth = useContext(AuthenticationContext);
        
        if(!auth.loaded){
            return null;
        }
        
        if((auth.user && !redirectAuthenticated) || (!auth.user && redirectAuthenticated)){
            return (<Component {...props} />);
        }else{
            return (<Redirect to={redirectUrl} />);
        }
    }
}