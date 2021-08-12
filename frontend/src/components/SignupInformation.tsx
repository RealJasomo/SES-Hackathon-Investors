import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import ImageUploadModal from './ImageUploadModal';

import styles from './SignupInformation.module.scss';

export default function SignupInformation(){
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [state, setState] = useState<string>('');
    const [avatar, setAvatar] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [avatarOpen, setAvatarOpen] = useState<boolean>(false);
    
    const handleTextChange = (updator: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updator(e.target.value);
    };
    
    return (
    <div className={styles.signupInformationContainer}>
        <div className={styles.optionalAboutInformation}>
            <div className={styles.avatarUpload}>
                <ImageUploadModal open={avatarOpen} onClose={() => setAvatarOpen(false)} setUrl={setAvatar}/>
                <p>Avatar (optional)</p>
                <div className={styles.avatar}
                    onClick={() => setAvatarOpen(true)}>
                    {avatar ? <img src={avatar} /> : <p>+</p>}
                </div>
            </div>
            <div className={styles.bio}>
                <p>Bio (optional)</p>
                <TextField value={bio} onChange={handleTextChange(setBio)} variant="outlined" fullWidth placeholder="enter a short bio..."/>
            </div>
        </div>
    </div>);    
}