import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import firebase from '@fire';

import { ReactComponent as GoogleIcon } from '@res/google.svg';
import styles from './LoginPage.module.scss';
import { Checkbox, FormControlLabel } from '@material-ui/core';


export default function LoginPage(){
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

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

    return(
    <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
            <div className={styles.loginForm}>
                <form onSubmit={handleSubmit}>
                    <h1 className={styles.loginHeader}>Login</h1>
                    <p className={styles.loginSubtitle}>Get ready for liftoff!</p>
                    <button 
                        className={styles.googleButton}
                        onClick={handleGooglelogin}>
                        <GoogleIcon className={styles.googleLogo}/>
                        <p>Sign In with Google</p>
                    </button>
                    <hr className={styles.loginDivider}/>
                    <div>
                        <p className={styles.fieldLabel}>Email*</p>
                        <TextField value={email} onChange={handleTextChange(setEmail)} placeholder="email@email.com" variant="outlined" fullWidth required/>
                    </div>
                    <div>
                        <p className={styles.fieldLabel}>Password*</p>
                        <TextField value={password} onChange={handleTextChange(setPassword)} placeholder="Min. 8 characters" type="password" variant="outlined" fullWidth required/>
                    </div>
                   <div className={styles.loginFooter}>
                       <FormControlLabel
                        label="Remember me"
                        labelPlacement="end"
                        control={<Checkbox color="primary"/>}/>
                        <a href="#">Forgot Password?</a>
                   </div>
                    <button
                        type="submit"
                        className={styles.loginButton}>
                            Login
                    </button>
                </form>
            </div>
            <div className={styles.loginAside}>
            
            </div>
        </div>
    </div>);
}