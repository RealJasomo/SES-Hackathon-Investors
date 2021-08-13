import { Typography } from '@material-ui/core';
import React from 'react';

import styles from './AboutPage.module.scss';
export default function AboutPage(){
    return (<div className={styles.about}>
        <Typography variant="h3">LaunchPad <Typography variant="subtitle1">Take your startup to the moon!</Typography></Typography>
        <Typography variant="h4">Members</Typography>
        <Typography>Anuva, Arjav, Jason, Pranay, Sam</Typography>
        <Typography variant="h4">Description</Typography>
        <Typography>Our web application's goal is to provide a simple platform to connect investors with startups.</Typography>
        <Typography variant="h4">Features</Typography>
        <Typography> - Simple sign up process or login with a Google account</Typography>
        <Typography> - Get recommendations of investors to contact and startups to explore!</Typography>
        <Typography> - Filter out investors and startups by name, location, or tags</Typography>
        <Typography> - Post about your own startup opportunity and catch the attention of serious backers</Typography>
        <Typography variant="h4">Tech Stack</Typography>
        <Typography> - React</Typography>
        <Typography> - Firebase</Typography>
    </div>);
}