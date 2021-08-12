import { useState, useEffect, useContext } from 'react';
import User from '@interfaces/User';
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

export default firebase;