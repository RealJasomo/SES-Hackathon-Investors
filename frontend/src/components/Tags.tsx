import React from 'react';

import styles from './Tags.module.scss';

interface ITagsProps{
    tags: string[]
}

export default function Tags(props: ITagsProps){
    return (
    <div className={styles.tagsContainer}>
        <p>Tags:</p>
        {props.tags.slice(0, 5).map((tag, idx) => <div className={styles.tag} key={idx}>{tag}</div>)}
    </div>);
}