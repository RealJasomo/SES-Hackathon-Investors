import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/storage';

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
export default firebase;