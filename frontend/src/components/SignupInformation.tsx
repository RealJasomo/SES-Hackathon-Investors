import React, { useContext, useState, useMemo } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Option from '@material-ui/core/MenuItem';
import ImageUploadModal from './ImageUploadModal';
import { AuthenticationContext } from '@contexts/AuthContext';
import { CountryContext } from '@contexts/CountryContext';

import styles from './SignupInformation.module.scss';
import { usersRef } from '@fire';


export default function SignupInformation(){
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [state, setState] = useState<string>('');
    const [avatar, setAvatar] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [avatarOpen, setAvatarOpen] = useState<boolean>(false);
    
    const countryContext = useContext(CountryContext);
    const authContext = useContext(AuthenticationContext);

    const states = useMemo(() => {
        if(country){
            return countryContext.countries?.find(c => c.code === country)?.states;
        }else{
            return null;
        }
    }, [country, countryContext.countries]);

    const handleTextChange = (updator: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updator(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await usersRef.doc(authContext.user?.uid ?? '').set({
            firstName,
            lastName,
            state,
            country,
            bio,
            profilePhoto: avatar,
            email: authContext.user?.email ?? '',
        }, { merge: true});
    }

    
    return (
    <form onSubmit={handleSubmit} className={styles.signupInformationContainer}>
        <div className={styles.optionalAboutInformation}>
            <div className={styles.avatarUpload}>
                <ImageUploadModal open={avatarOpen} onClose={() => setAvatarOpen(false)} setUrl={setAvatar}/>
                <p>Avatar (optional)</p>
                <div className={styles.avatar}
                    onClick={() => setAvatarOpen(true)}>
                    {avatar ? <img src={avatar} alt="user avatar"/> : <p>+</p>}
                </div>
            </div>
            <div className={styles.bio}>
                <p>Bio (optional)</p>
                <TextField value={bio} onChange={handleTextChange(setBio)} variant="outlined" fullWidth placeholder="enter a short bio..."/>
            </div>
        </div>
        <div className={styles.requiredAboutInformation}>
            <div className={styles.textField}>
                <p>First Name*</p>
                <TextField value={firstName} onChange={handleTextChange(setFirstName)} variant="outlined" fullWidth required></TextField>
            </div>
            <div className={styles.textField}>
                <p>Last Name*</p>
                <TextField value={lastName} onChange={handleTextChange(setLastName)} variant="outlined" fullWidth required></TextField>
            </div>
            <div className={styles.countryPicker}>
                <p>Country*</p>
                <Select
                    value={country}
                    onChange={e => setCountry(e.target.value as string)}
                    fullWidth
                    required>
                    {countryContext.countries?.map?.(country => <Option key={country.code} value={country.code}>{country.name}</Option>)}
                </Select>
                {states&&<>
                    <p>State*</p>
                    <Select
                        value={state}
                        onChange={e => setState(e.target.value as string)}
                        fullWidth
                        required={!!states}>
                        {states.map(state =><Option key={state.code} value={state.code}>{state.name}</Option>)}
                    </Select>
                </>}
            </div>
            <button type="submit" className={styles.saveButton}>Blast off!</button>
        </div>
    </form>);    
}