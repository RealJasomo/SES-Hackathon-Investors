import React, { useState } from 'react';
import withAuthentication from '@hoc/withAuthentication';
import { useFirebaseUser, useInvestments, useInvestors, useStartups } from '@fire';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import UserCard from '@components/UserCard';
import StartupCard from '@components/StartupCard';
import { capitalize } from '@util/utils';

import styles from './Dashboard.module.scss';


const tabs: string[] = ["My Investors", "My Startups", "My Investments"];

function Dashboard(){
    const [activeTab, setActiveTab] = useState<number>(0);
    const user = useFirebaseUser();
    const investments = useInvestments();
    const investors = useInvestors();
    const startups = useStartups();

    const handleTabChange = (_, val) => {
        setActiveTab(val);
    };
    return (
    <div className={styles.dashboard}>
        <h1 className={styles.welcome}>Welcome back, {capitalize(user?.firstName ?? 'FirstName')}!</h1>
        <div className={styles.mySection}>
             <h2 className={styles.sectionHeading}>Investors, Startups, and Investments</h2>
             <Tabs
                value={activeTab}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleTabChange}>
                {tabs.map((tab, idx) => <Tab label={tab} key={idx}/>)}
             </Tabs>
             {activeTab===0 &&
             <div className={styles.tab}>
                 {investors.map((investor, idx) => <UserCard key={idx} user={investor}/>)}
             </div>}
             {activeTab===1 &&
             <div className={styles.tab}>
                 {startups.map((startup, idx) => <StartupCard key={idx} startup={startup}/>)}
             </div>}
             {activeTab===2 &&
             <div className={styles.tab}>
                 {investments.map((investment, idx) => <StartupCard key={idx} startup={investment} />)}
             </div>}
        </div>
        {/* <div className={styles.feed}>
            <h2 className={styles.sectionHeading}>Feed</h2>
        </div> */}
    </div>);
}

export default withAuthentication(Dashboard);