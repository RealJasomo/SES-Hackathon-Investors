import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Slider from '@material-ui/core/Slider';
import { useFirebaseUser, useInvestInStartup } from '@fire';

import styles from './InvestModal.module.scss';
import { TextField } from '@material-ui/core';

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
    const [displayValue, setDisplayValue] = useState<string>('');
    const execute = useInvestInStartup(Number(Number(displayValue).toFixed(2)), props.startupId, !!props.increaseMode);
    return (
    <Modal
        open={props.open}
        onClose={props.onClose}>
        <div className={styles.investModal}>
            {error&&<p className={styles.error}>{error}</p>}
            {user?.balance ? <>
                <h1>Invest in {props.startupName}</h1>
                <TextField type="number" required value={displayValue} onChange={(e) => {
                    if (Number(e.target.value) >= 0) {
                        setDisplayValue(e.target.value);
                        setValue(Number(e.target.value));
                    }
                }}/>
                <Slider
                    value={value}
                    min={0}
                    step={0.01}
                    max={user?.balance ?? 0}
                    onChange={(_, value) => {
                            setValue(value as number);
                            setDisplayValue(value.toString() as string);
                        }
                    }
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