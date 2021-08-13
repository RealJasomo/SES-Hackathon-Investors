import React from 'react';
import withAuthentication from '@hoc/withAuthentication';

import MeetTheTeam from '@res/meetTheTeam.png';
import LandingHeader from '@res/landingHeader.png'
import styles from './HomePage.module.scss';

function HomePage(){

    return (
        <div className={styles.home}>
            <img src={LandingHeader} alt="header"/>
            <img src={MeetTheTeam} alt="meet the team"/>
        </div>);
}

export default withAuthentication(HomePage, '/dashboard', true);