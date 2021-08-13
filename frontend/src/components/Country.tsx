import React, { useContext } from 'react';
import { CountryContext } from '@contexts/CountryContext';

import RoomIcon from '@material-ui/icons/Room';
import styles from './Country.module.scss';

interface ICountryProps{
    country: string,
    state?: string,
}

export default function Country(props: ICountryProps){

    const countryContext = useContext(CountryContext);
    
    const renderLocation = (country: string, state?: string) => {
        const countryObject = countryContext.countries?.find(c => c.code === country);
        if(state&&countryObject){
            const stateObject = countryObject.states?.find(s => s.code === state);
            return `${stateObject?.name}, ${countryObject.code}`
        }else{
            return countryObject?.name;
        }
    }
    return (
    <div className={styles.country}>
        <p className={styles.label}>Country / State :</p>
        <p className={styles.location}><RoomIcon className={styles.pin}/> {renderLocation(props.country,props.state)}</p>
    </div>);
}