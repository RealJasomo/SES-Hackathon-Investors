import firebase from '@fire';

export default interface Startup{
    id: string,
    amountInvested: number,
    country: string,
    description: string,
    goal: number,
    investors: firebase.firestore.DocumentReference[],
    logo: string,
    name: string,
    owner: firebase.firestore.DocumentReference,
    state: string,
    tags: string[],
}