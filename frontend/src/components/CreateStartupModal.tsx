import React from 'react';
import { useFirebaseUser } from '@fire';
import Modal from '@material-ui/core/Modal';

import styles from './CreateStartupModal.module.scss';

interface ICreateStartupModalProps{
    open: boolean,
    onClose: () => void,
 }
 
export default function CreateStartupModal(props: ICreateStartupModalProps){
    const user = useFirebaseUser();

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}>
            <div className={styles.createStartup}>
                <h1>Create New Startup</h1>
            </div>
        </Modal>);
}