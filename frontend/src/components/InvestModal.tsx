import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Slider from '@material-ui/core/Slider';
import { useFirebaseUser, useInvestInStartup } from '@fire';

import styles from './InvestModal.module.scss';

interface IInvestModalProps{
   open: boolean,
   onClose: () => void,
   startupId: string,
   startupName: string,
   increaseMode?: boolean
}

export default function InvestModal(props: IInvestModalProps)
{
    const [value, setValue] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const user = useFirebaseUser();
    const execute = useInvestInStartup(value, props.startupId, !!props.increaseMode);
    return (
    <Modal
        open={props.open}
        onClose={props.onClose}>
        <div className={styles.investModal}>
            {error&&<p className={styles.error}>{error}</p>}
            {user?.balance ? <>
                <h1>Invest in {props.startupName}</h1>
                <p>Value ${value.toFixed(2).toLocaleString()}</p>
                <Slider
                    value={value}
                    min={0}
                    step={0.01}
                    max={user?.balance ?? 0}
                    onChange={(_, value) => setValue(value as number)}
                    />
                <button onClick={async () => {
                    if(await execute()){
                        setError('');
                        props.onClose();
                    }else{
                        setError('Could not invest!');
                    }
                }} className={styles.investButton}>Invest</button>
            </>: <h1>Sorry, you do not have enough money to invest!</h1>}
        </div>
    </Modal>);
}