import React from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as Logo } from '@res/launchpad.svg';
import styles from './UnauthedNav.module.scss';
import { Button } from '@material-ui/core';

export default function UnauthedNav(){
    const history = useHistory();
    return (
    <div className={styles.unAuthenticatedNav}>
        <Logo onClick={() => history.push('/')} className={styles.logo}/>
        <p onClick={()=>history.push('/about')}>About</p>
        <p onClick={()=>history.push('/contact')}>Contact</p>
        <Button onClick={()=>history.push('/login')}>Login</Button>
        <Button onClick={()=>history.push('/signup')}>Signup</Button>
    </div> 
    );
}