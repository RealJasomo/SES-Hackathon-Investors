import React from 'react';
import LoginForm from '@components/LoginForm';
import withAuthentication from '@hoc/withAuthentication';

import styles from './LoginPage.module.scss';

function LoginPage(){
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

export default withAuthentication(LoginPage, '/dashboard', true);