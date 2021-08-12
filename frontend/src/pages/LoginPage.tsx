import React from 'react';
import LoginForm from '@components/LoginForm';

import styles from './LoginPage.module.scss';

export default function LoginPage(){
    return(
    <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
            <div className={styles.loginForm}>
                <LoginForm/>
            </div>
            <div className={styles.loginAside}>
            
            </div>
        </div>
    </div>);
}