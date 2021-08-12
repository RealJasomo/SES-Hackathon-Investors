import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { ReactComponent as GoogleIcon } from '@res/google.svg';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import firebase from '@fire';

import styles from './LoginForm.module.scss';
import HrWithText from './HrWithText';

interface ILoginFormProps{
    signup?: boolean
}

export default function LoginForm(props: ILoginFormProps){
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const action = props.signup ? 'Up' : 'In';
    const pageType = props.signup ? 'Sign Up' : 'Login'
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await firebase.auth().signInWithEmailAndPassword(email, password);
    }
    
    const handleTextChange = (updator: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updator(e.target.value);
    };

    const handleGooglelogin = async () => {
        var provider: firebase.auth.GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();
        await firebase.auth().signInWithPopup(provider);
    }

    return (
        <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <h1 className={styles.loginHeader}>{pageType}</h1>
                    <p className={styles.loginSubtitle}>Get ready for liftoff!</p>
                    <button 
                        className={styles.googleButton}
                        onClick={handleGooglelogin}>
                        <GoogleIcon className={styles.googleLogo}/>
                        <p>Sign {action} with Google</p>
                    </button>
                    <HrWithText text={`or Sign ${action} with Email`}/>
                    <div>
                        <p className={styles.fieldLabel}>Email*</p>
                        <TextField value={email} onChange={handleTextChange(setEmail)} placeholder="email@email.com" variant="outlined" fullWidth required/>
                    </div>
                    <div>
                        <p className={styles.fieldLabel}>Password*</p>
                        <TextField value={password} onChange={handleTextChange(setPassword)} placeholder="Min. 8 characters" type="password" variant="outlined" fullWidth required/>
                    </div>
                   {!props.signup&&<div className={styles.loginFooter}>
                       <FormControlLabel
                        label="Remember me"
                        labelPlacement="end"
                        control={<Checkbox color="primary"/>}/>
                        <a href="#">Forgot Password?</a>
                   </div>}
                    <button
                        type="submit"
                        className={styles.loginButton}>
                            {pageType}
                    </button>
                </form>
    );
}