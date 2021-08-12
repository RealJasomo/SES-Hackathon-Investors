import firebase from '@fire';

export default interface User {
    bio: string,
    country: string,
    email: string,
    firstName: string,
    lastName: string,
    profilePhoto?: string,
    state: string,
    tags?: string[],
    ownedStartups?: firebase.firestore.DocumentReference[],
    investedStartups?: firebase.firestore.DocumentReference[],
    balance?: number
}