import React from 'react';
import withAuthentication from '@hoc/withAuthentication';

import styles from './HomePage.module.scss';

function HomePage(){

    return (
        <div className={styles.home}>
        </div>);
}

export default withAuthentication(HomePage, '/dashboard', true);