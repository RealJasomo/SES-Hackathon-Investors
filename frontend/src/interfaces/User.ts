import firebase from '@fire';

export default interface User {
    id: string, 
    bio: string,
    country: string,
    email: string,
    firstName: string,
    lastName: string,
    isInvestor: boolean,
    profilePhoto?: string,
    state: string,
    tags?: string[],
    ownedStartups?: firebase.firestore.DocumentReference[],
    investedStartups?: firebase.firestore.DocumentReference[],
    balance?: number
}