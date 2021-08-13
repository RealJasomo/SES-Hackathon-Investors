import React, { useState, useRef} from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { v4 as uuid } from 'uuid';

import styles from './ImageUploadModal.module.scss';
import firebase, { storageRef } from '@fire';

interface IImageUploadModalProps{
    open: boolean,
    onClose: () => void,
    setUrl: React.Dispatch<React.SetStateAction<string>>,
    collection?: string,
}

export default function ImageUploadModal(props: IImageUploadModalProps){
    const [error, setError] = useState<string>('');

    const fileUploadRef = useRef<HTMLInputElement | null>(null);

    const handleUploadButton = () => {
        fileUploadRef.current?.click();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if(files){
            const file = files[0];
            await storageRef.child(`${props.collection ?? 'Profile Photos'}/${uuid()}-${file.name}`)
                    .put(file)
                    .then(async (snapshot: firebase.storage.UploadTaskSnapshot) => {
                        const url = await snapshot.ref.getDownloadURL();
                        props.setUrl(url);
                        props.onClose();
                    })
                    .catch((error: firebase.FirebaseError) => setError(error.message));
        }
    };
    return ( 
        <Modal 
        open={props.open}
        onClose={props.onClose}>
            <div className={styles.modal}>
                {error&&<p className={styles.error}>{error}</p>}
                <h1>Upload Image</h1>
                <input ref={fileUploadRef} type="file" style={{display: 'none'}} onChange={handleFileUpload} accept="image/*"/>
                <Button className={styles.button} onClick={handleUploadButton}>upload</Button>
            </div>
    </Modal>);
}