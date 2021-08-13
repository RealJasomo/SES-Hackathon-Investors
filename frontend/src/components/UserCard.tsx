import React from 'react';
import Avatar  from '@material-ui/core/Avatar';
import Tags from '@components/Tags';
import Country from './Country';

import { capitalize } from '@util/utils';
import User from '@interfaces/User';

import Mail from '@material-ui/icons/Mail'
import styles from './UserCard.module.scss';

interface IUserCardProps {
    user: User | null,
}

export default function UserCard(props: IUserCardProps) {
    return(
    <div className={styles.userCard}>
        <Avatar className={styles.avatar} src={props.user?.profilePhoto} alt="profile photo" />
        <p className={styles.name}>Name: {capitalize(props.user?.firstName ?? '')} {capitalize(props.user?.lastName ?? '')}</p>
        <p className={styles.bio}>Bio: {props.user?.bio}</p>
        <div className={styles.mailContainer}>
            <p className={styles.label}>Email: </p>
            <a className={styles.email} href={`mailto:${props.user?.email}`}><Mail className={styles.mail}/>{props.user?.email}</a>
        </div>
        <Country country={props.user?.country ?? ''} state={props.user?.state}/>
        <Tags tags={props.user?.tags ?? []}/>
    </div>);
}