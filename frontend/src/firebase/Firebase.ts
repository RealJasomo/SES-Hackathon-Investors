import { useState, useEffect, useContext } from 'react';
import User from '@interfaces/User';
import Startup from '@interfaces/Startup';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/storage';
import { AuthenticationContext } from '@contexts/AuthContext';

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGESENDER,
};

firebase.initializeApp(config);

export const storageRef = firebase.storage().ref();
export const usersRef = firebase.firestore().collection('users');


export function useFirebaseUser(): User | null { 
    const [user, setUser] = useState<User | null>(null);
    const auth = useContext(AuthenticationContext);
    
    useEffect(() => {
        if(auth.user){
          usersRef.doc(auth.user.uid).onSnapshot(snap => {
              if(snap.exists){
                  setUser(snap.data() as User);
              }
        });
        }
    }, [auth.user]);
    
    return user;
}

export function useInvestments(): Startup[]{
    const user = useFirebaseUser();
    const [startups, setStartups] = useState<Startup[]>([]);
    useEffect(() => {
        if(user){
            const startups = user.investedStartups?.map(async (startupRef) => {
                return (await startupRef.get()).data() as Startup;
            });
            Promise.all(startups ?? []).then(startups => setStartups(startups));
        }
    }, [user]);
    return startups;
}

export function useInvestors(): User[] {
    const startups = useStartups();
    const [investors, setInvenstors]= useState<User[]>([]);
    useEffect(() => {
        if(startups.length != 0){
            const investors = startups.map(startup => startup.investors?.map(async investor => {
                return (await investor.get()).data() as User;
            })).reduce((a, c) => {
                return [...a, ...c]
            }, []);
            Promise.all(investors).then(users => setInvenstors(users));
        }
    }, [startups]);
    return investors;
}

export function useStartups(): Startup[]{
    const user = useFirebaseUser();
    const [startups, setStartups] = useState<Startup[]>([]);
    
    useEffect(() => {
        if(user){
            const startups = user.ownedStartups?.map(async (startupRef) => {
                return (await startupRef.get()).data() as Startup;
            });
            Promise.all(startups ?? []).then(startups => setStartups(startups));
        }
    }, [user]);

    return startups;
}


export default firebase;