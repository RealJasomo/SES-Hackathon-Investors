import React, { useState, useContext, useMemo } from 'react';
import { useFirebaseUser, usersRef } from '@fire';
import Modal from '@material-ui/core/Modal';
import ImageUploadModal from './ImageUploadModal';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Option from '@material-ui/core/MenuItem';
import { CountryContext } from '@contexts/CountryContext';
import firebase from '@fire';
import Startup from '@interfaces/Startup';
import { useHistory } from 'react-router-dom';

import styles from './CreateStartupModal.module.scss';

interface ICreateStartupModalProps{
    open: boolean,
    onClose: () => void,
 }
 
export default function CreateStartupModal(props: ICreateStartupModalProps){
    const user = useFirebaseUser();
    const history = useHistory();
    const countryContext = useContext(CountryContext);
    const [logo, setLogo] = useState<string>('');
    const [logoOpen, setLogoOpen] = useState<boolean>(false);
    const [country, setCountry] = useState<string>('');
    const [state, setState] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [goal, setGoal] = useState<number>(0);
    
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

    const handleCreateStartup = async () => {
        if(!user){
            return;
        }
        let userRef = usersRef.doc(user.id);
        let {id: _, ...startup} = ({
            id: '', 
            logo,
            country,
            state,
            name,
            description,
            goal,
            amountInvested: 0,
            investors: [],
            tags: [...(user?.tags ?? [])],
            owner: userRef
        }) as Startup;
        const {id: __, ...userPayload} = user;
        if(!userPayload.ownedStartups){
            userPayload.ownedStartups = [];
        }
        const docRef = firebase.firestore().collection('startups').doc();
        userPayload.ownedStartups.push(docRef);
        const result = await firebase.firestore().runTransaction(async transaction => {
            await transaction.set(docRef, startup);
            await transaction.set(userRef, userPayload);
        }).then(() => true)
          .catch(() => false);
        if(result){
            history.push('/dashboard');
            props.onClose();
        }
    }

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}>
            <div className={styles.createStartup}>
                <h1>Create New Startup</h1>
                <div className={styles.content}>
                    <div className={styles.contentHead}>
                        <div className={styles.logoUpload}>
                            <p className={styles.label}>Logo*</p>
                            <ImageUploadModal
                                open={logoOpen}
                                onClose={() => setLogoOpen(false)}
                                setUrl={setLogo}
                                collection="Logos"/>
                            <div className={styles.avatar}
                                onClick={() => setLogoOpen(true)}>
                                {logo ? <img src={logo} alt="user avatar"/> : <p>+</p>}
                            </div>
                        </div>
                        <div className={styles.name}>
                            <p className={styles.label}>Name*</p>
                            <TextField value={name} onChange={handleTextChange(setName)} variant="outlined" fullWidth/>
                        </div>
                    </div>
                    <div className={styles.description}>
                        <p className={styles.label}>Description*</p>
                        <TextField value={description} onChange={handleTextChange(setDescription)} variant="outlined" fullWidth/>
                    </div>
                    <div className={styles.goal}>
                        <p className={styles.label}>Goal ($)*</p>
                        <TextField value={goal} onChange={e => setGoal(Number(e.target.value))} variant="outlined" fullWidth type="number"/>
                    </div>
                    <div className={styles.location}>
                        <p className={styles.label}>Location</p>
                        <p className={styles.label}>Country*</p>
                        <Select
                            value={country}
                            onChange={e =>{ 
                                setCountry(e.target.value as string);
                                setState('');
                            }}
                            fullWidth
                            required>
                            {countryContext.countries?.map?.(country => <Option key={country.code} value={country.code}>{country.name}</Option>)}
                        </Select>
                        {states&&<>
                            <p className={styles.label}>State*</p>
                            <Select
                                value={state}
                                onChange={e => setState(e.target.value as string)}
                                fullWidth
                                required={!!states}>
                                {states.map(state =><Option key={state.code} value={state.code}>{state.name}</Option>)}
                            </Select>
                            </>}
                    </div>
                    <div className={styles.submit}>
                        <button onClick={handleCreateStartup} className={styles.submitButton}>Create Startup</button>
                    </div>
                </div>
            </div>
        </Modal>);
}