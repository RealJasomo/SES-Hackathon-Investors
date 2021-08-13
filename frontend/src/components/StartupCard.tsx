import React, { useState, useMemo } from 'react';
import Startup from '@interfaces/Startup';
import Avatar from '@material-ui/core/Avatar';
import Tags from '@components/Tags';
import { useInvestments, useStartups } from '@fire';
import LinearProgress from '@material-ui/core/LinearProgress';
import InvestModal from './InvestModal';
import Country from './Country';

import styles from './StartupCard.module.scss';

interface IStartupCardProps{
    startup: Startup
}

export default function StartupCard(props: IStartupCardProps){
    const [investModalOpen, setInvestModalOpen] = useState<boolean>(false);
    const [investIncreaseModalOpen, setInvestIncreaseModalOpen] = useState<boolean>(false);

    const investments = useInvestments();
    const startups = useStartups();

    const canInvest: boolean = useMemo(() => {
        const isInvestment = investments.findIndex(startup => startup.id === props.startup.id) !== -1;
        const isStartup = startups.findIndex(startup => startup.id === props.startup.id) !== -1;
        return !isInvestment&&!isStartup;
    }, [props.startup, investments, startups]);

    const canIncrease: boolean = useMemo(() => {
        return investments.findIndex(startup => startup.id === props.startup.id) !== -1;
    }, [investments, props.startup]);
    
    return (
    <div className={styles.startupCard}>
        <InvestModal 
            open={investModalOpen} 
            onClose={() => setInvestModalOpen(false)} 
            startupId={props.startup.id}
            startupName={props.startup.name}/>
        <InvestModal 
            open={investIncreaseModalOpen} 
            onClose={() => setInvestIncreaseModalOpen(false)} 
            startupId={props.startup.id}
            startupName={props.startup.name}
            increaseMode/>
        <h1 className={styles.header}><Avatar className={styles.avatar} src={props.startup.logo} alt="startup logo"/>{props.startup.name}</h1>
        <p className={styles.description}>{props.startup.description}</p>
        <Country country={props.startup.country} state={props.startup.state}/>
        <Tags tags={props.startup.tags}/>
        <div className={styles.goal}>
            <p> Raised ${props.startup.amountInvested.toLocaleString()} / ${props.startup.goal.toLocaleString()}</p>
            <LinearProgress variant="determinate" value={Math.round(100*(props.startup.amountInvested / props.startup.goal))}/>
        </div>
        {canInvest&&<button onClick={() => setInvestModalOpen(true)} className={styles.investButton}>Invest</button>}
        {!canInvest&&canIncrease&&<button onClick={() => setInvestIncreaseModalOpen(true)} className={styles.investIncreaseButton}>Increase Investment</button>}
    </div>)
}
