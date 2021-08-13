import { Typography } from '@material-ui/core';
import React from 'react';

import styles from './ContactPage.module.scss';

export default function ContactPage(){
    return (<div className={styles.contact}>
        <a href="https://github.com/RealJasomo/SES-Hackathon-Investors"><Typography>Project GitHub</Typography></a>
    </div>);
}