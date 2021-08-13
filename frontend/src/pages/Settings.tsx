import React, { useContext, useState, useMemo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Option from '@material-ui/core/MenuItem';
import ImageUploadModal from '@components/ImageUploadModal';
import { AuthenticationContext } from '@contexts/AuthContext';
import countriesList from '@res/countries.json';
import { useFirebaseUser, usersRef } from '@fire';

import styles from './Settings.module.scss';
import User from '@interfaces/User';
import { Typography } from '@material-ui/core';

function Settings(){
    const user = useFirebaseUser();
    const [formData, setFormData] = useState<User>({
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        country: user?.country ?? '',
        state: user?.state ?? '',
        profilePhoto: user?.profilePhoto ?? '',
        bio: user?.bio ?? '',
        avatarOpen: false,
        isInvestor: user?.isInvestor ?? false,
        id: user?.id ?? '',
        email: user?.email ?? ''
    } as User);

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user])
    //const [firstName, setFirstName] = useState<string>('');
    //const [lastName, setLastName] = useState<string>('');
    //const [country, setCountry] = useState<string>('');
    //const [state, setState] = useState<string>('');
    //const [avatar, setAvatar] = useState<string>('');
   // const [bio, setBio] = useState<string>('');
    const [avatarOpen, setAvatarOpen] = useState<boolean>(false);
    const [updatedStatus, setUpdatedStatus] = useState(false);
    
    const authContext = useContext(AuthenticationContext);
    const history = useHistory();

    const states = useMemo(() => {
        if(formData.country){
            return countriesList.countries?.find(c => c.code === formData.country)?.states;
        }else{
            return null;
        }
    }, [formData.country, countriesList.countries]);

    const handleTextChange = (updator: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updator(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await usersRef.doc(authContext.user?.uid ?? '').update(formData).then(() => {
            setUpdatedStatus(true);
        });
    }

    function handleSetUrl(url) {
        setFormData({...formData, profilePhoto: url});
    }
    
    return (
    <form onSubmit={handleSubmit} className={styles.signupInformationContainer}>
        <div className={styles.optionalAboutInformation}>
            <div className={styles.avatarUpload}>
                <ImageUploadModal open={avatarOpen} onClose={() => setAvatarOpen(false)} setUrl={handleSetUrl}/>
                <p>Avatar</p>
                <div className={styles.avatar}
                    onClick={() => setAvatarOpen(true)}>
                    {formData.profilePhoto ? <img src={formData.profilePhoto} alt="user avatar"/> : <p>+</p>}
                </div>
            </div>
            <div className={styles.bio}>
                <p>Bio</p>
                <TextField value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} variant="outlined" multiline fullWidth placeholder="enter a short bio..."/>
            </div>
        </div>
        <div className={styles.requiredAboutInformation}>
            <div className={styles.textField}>
                <p>First Name*</p>
                <TextField value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} variant="outlined" fullWidth required></TextField>
            </div>
            <div className={styles.textField}>
                <p>Last Name*</p>
                <TextField value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} variant="outlined" fullWidth required></TextField>
            </div>
            <div className={styles.countryPicker}>
                <p>Country*</p>
                <Select
                    value={formData.country}
                    onChange={e => {
                        setFormData({...formData, country: e.target.value as string, state: ''})
                    }}
                    fullWidth
                    required>
                    {countriesList.countries?.map?.(country => <Option key={country.code} value={country.code}>{country.name}</Option>)}
                </Select>
                {states&&<>
                    <p>State*</p>
                    <Select
                        value={formData.state}
                        onChange={e => setFormData({...formData, state: e.target.value as string})}
                        fullWidth
                        required={!!states}>
                        {states.map(state =><Option key={state.code} value={state.code}>{state.name}</Option>)}
                    </Select>
                </>}
            </div>
            <button type="submit" className={styles.saveButton}>Update</button>
            {updatedStatus ? <Typography variant="overline">Sucessfully updated!</Typography> : <></>}
        </div>
    </form>);    
}

export default Settings
