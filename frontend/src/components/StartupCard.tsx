import React from 'react';
import Startup from '@interfaces/Startup';
import Avatar from '@material-ui/core/Avatar';
import Tags from '@components/Tags';

import styles from './StartupCard.module.scss';
import LinearProgress from '@material-ui/core/LinearProgress';

interface IStartupCardProps{
    startup: Startup
}

export default function StartupCard(props: IStartupCardProps){
    return (
    <div className={styles.startupCard}>
        <h1 className={styles.header}><Avatar className={styles.avatar} src={props.startup.logo} alt="startup logo"/>{props.startup.name}</h1>
        <p className={styles.description}>{props.startup.description}</p>
        <Tags tags={props.startup.tags}/>
        <div className={styles.goal}>
            <p> Raised ${props.startup.amountInvested.toLocaleString()} / ${props.startup.goal.toLocaleString()}</p>
            <LinearProgress variant="determinate" value={Math.round(100*(props.startup.amountInvested / props.startup.goal))}/>
        </div>
    </div>)
}
