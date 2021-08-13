import React, { useState, useMemo } from 'react';
import Startup from '@interfaces/Startup';
import Avatar from '@material-ui/core/Avatar';
import Tags from '@components/Tags';
import { useInvestments, useStartups } from '@fire';
import LinearProgress from '@material-ui/core/LinearProgress';
import InvestModal from './InvestModal';

import styles from './StartupCard.module.scss';

interface IStartupCardProps{
    startup: Startup
}

export default function StartupCard(props: IStartupCardProps){
    const [investModalOpen, setInvestModalOpen] = useState<boolean>(false);

    const investiments = useInvestments();
    const startups = useStartups();

    const canInvest: boolean = useMemo(() => {
        const isInvestiment = investiments.findIndex(startup => startup.id === props.startup.id) !== -1;
        const isStartup = startups.findIndex(startup => startup.id === props.startup.id) !== -1;
        return !isInvestiment&&!isStartup;
    }, [props.startup, investiments, startups]);
    
    return (
    <div className={styles.startupCard}>
        <InvestModal 
            open={investModalOpen} 
            onClose={() => setInvestModalOpen(false)} 
            startupId={props.startup.id}
            startupName={props.startup.name}/>
        <h1 className={styles.header}><Avatar className={styles.avatar} src={props.startup.logo} alt="startup logo"/>{props.startup.name}</h1>
        <p className={styles.description}>{props.startup.description}</p>
        <Tags tags={props.startup.tags}/>
        <div className={styles.goal}>
            <p> Raised ${props.startup.amountInvested.toLocaleString()} / ${props.startup.goal.toLocaleString()}</p>
            <LinearProgress variant="determinate" value={Math.round(100*(props.startup.amountInvested / props.startup.goal))}/>
        </div>
        {canInvest&&<button onClick={() => setInvestModalOpen(true)} className={styles.investButton}>Invest</button>}
    </div>)
}
