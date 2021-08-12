import React from 'react';

import styles from './HrWithText.module.scss';

interface IHrWithTextProps{
    text: string
}
export default function HrWithText(props: IHrWithTextProps){
    return (<hr className={styles.hr} data-text={props.text}/>);
}