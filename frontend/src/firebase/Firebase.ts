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
                  setUser({
                    id: snap.id,
                    ...snap.data()
                } as User);
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
                return {
                    id: startupRef.id, 
                    ...(await startupRef.get()).data()
                } as Startup;
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
        if(startups.length !== 0){
            const investors = startups.map(startup => startup.investors?.map(async investor => {
                return {
                    id: investor.id,
                    ...(await investor.get()).data(),
                }as User;
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
                return {
                    id: startupRef.id,
                    ...(await startupRef.get()).data(),
                } as Startup;
            });
            Promise.all(startups ?? []).then(startups => setStartups(startups));
        }
    }, [user]);

    return startups;
}

export function useRecommendedStartups() : Startup[] {
    const user = useFirebaseUser();
    const [recommendedStartups, setRecommendedStartups] = useState<Startup[]>([])
    const db = firebase.firestore();
    
    // logic to select default recommendations

    function containsTags(tags, target) {
        if (tags !== undefined && tags !== null) {
            tags.forEach(tag => {
                if (tag.toLowerCase().includes(target.toLowerCase()) || target.toLowerCase().includes(tag.toLowerCase())) {
                    return true;
                }
            });
        }
        return false;
    }

    useEffect(() => {
        let arr: Startup[] = [];
        if (user) {
            db.collection("startups").limit(100).onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    let startup = doc.data();
                    let validate = false;

                    // add them if any tags match
                    if (user.tags !== null && user.tags !== undefined && startup.tags !== undefined) {
                        startup.tags.forEach(tag => {
                            validate = validate || containsTags(user.tags, tag);
                        });
                    }

                    // Match user's tags to startup name
                    validate = validate || (user.tags !== undefined && containsTags(user.tags, startup.name));

                    // Match user's location 
                    validate = validate || (user.country === startup.country);
                    validate = validate || (user.state === startup.state);

                    if (validate) {
                        arr.push({ 
                            id: doc.id,
                             ...startup 
                            }as Startup);
                    }
                });
                setRecommendedStartups(arr);
            });
        }
    }, [user]);

    return recommendedStartups;
}


export function useRecommendedInvestors() : User[] {
    const user = useFirebaseUser();
    const [recommendedInvestors, setRecommendedInvestors] = useState<User[]>([]);
    const db = firebase.firestore();
    
    // logic to select default recommendations

    function containsTags(tags, target) {
        if (tags !== undefined && tags !== null) {
            tags.forEach(tag => {
                if (tag.toLowerCase().includes(target.toLowerCase()) || target.toLowerCase().includes(tag.toLowerCase())) {
                    return true;
                }
            });
        }
        return false;
    }

    useEffect(() => {
        let arr: User[] = [];
        if (user) {
            db.collection("users").limit(100).onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    let investor = doc.data();
                    let validate = false;

                    // add them if any tags match
                    if (user.tags !== null && user.tags !== undefined && investor.tags !== undefined) {
                        investor.tags.forEach(tag => {
                            validate = validate || containsTags(user.tags, tag);
                        });
                    }

                    // Match user and investor locations
                    validate = validate || (user.country === investor.country);
                    validate = validate || (user.state === investor.state);

                    if (validate && investor.isInvestor && user.email !== investor.email) {
                        arr.push({ 
                            id: doc.id,
                            ...investor
                        } as User);
                    }
                });
                setRecommendedInvestors(arr);
            });
        }
    }, [user]);
    return recommendedInvestors;
}

export function useInvestInStartup(value: number, id: string, increaseMode: boolean): () => Promise<boolean>{
    const user = useFirebaseUser();

    const execute = async () => {
       if(!user || value  > (user?.balance??0)){
           return false;
       }
       let userModify = {...user};
       const userRef = firebase.firestore().collection('users').doc(user.id);
       const docRef =  firebase.firestore().collection('startups').doc(id);
       let docData: Startup = ({
             id,
           ...(await docRef.get()).data(),
        }) as Startup;
        if(!increaseMode){
            if(!userModify.investedStartups){
                userModify.investedStartups = [];
            }
            userModify.investedStartups.push(docRef);
            if(!docData.investors){
                docData.investors = [];
            }
            docData.investors.push(userRef);
        }
        if(userModify.balance){
            userModify.balance -= value;
        }
        docData.amountInvested += value;
        const {id: _, ...doc} = docData;
        const {id: __, ...userDoc} = userModify;
        userDoc.isInvestor = true;
        const result = await firebase.firestore().runTransaction(async transaction => {
            await transaction.set(docRef, doc, { merge: true});
            await transaction.set(userRef, userDoc, { merge: true });
        }).then(() => true)
        .catch((error) =>{
            console.log(error);
            return false;
        });

       return result;
    };

    return execute;
}

export default firebase;