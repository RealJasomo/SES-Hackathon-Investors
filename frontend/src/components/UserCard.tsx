import React from 'react';
import Avatar  from '@material-ui/core/Avatar';

import { capitalize } from '@util/utils';
import User from '@interfaces/User';

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
        <p className={styles.balance}>Balance: ${props.user?.balance?.toLocaleString() ?? '0'}</p>
    </div>);
}