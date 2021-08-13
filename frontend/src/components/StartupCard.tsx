import React from 'react';
import Startup from '@interfaces/Startup';
import Avatar from '@material-ui/core/Avatar';

import styles from './StartupCard.module.scss';

interface IStartupCardProps{
    startup: Startup
}

export default function StartupCard(props: IStartupCardProps){
    return (
    <div className={styles.startupCard}>
        <h1><Avatar src={props.startup.logo} alt="startup logo"/>{props.startup.name}</h1>
        <p>{props.startup.description}</p>
        <p> raised ${props.startup.amountInvested.toLocaleString()} / goal $ {props.startup.goal.toLocaleString()}</p>
    </div>)
}