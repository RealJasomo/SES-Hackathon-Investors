import React, { useState } from 'react';
import firebase, { useFirebaseUser } from '@fire'


function StartupInvest() {
    const db = firebase.firestore();
    const user = useFirebaseUser();
    const [allowInvest, setAllowInvest] = useState(false);
    const [investAmount, setInvestAmount] = useState(0.0);
    function completeTransaction(amount) {

    }

    function handleInvestAmount(e) {
        let amount = e.target.value;
        if (user !== null && user.balance !== undefined && user.balance >= amount) {
            completeTransaction(amount);
        }
    }

    return (
        <div>
            <form>
                <label><input onChange={handleInvestAmount}></input></label>
            </form>

        </div>
    )
}

export default StartupInvest
