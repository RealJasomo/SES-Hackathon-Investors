import React, { createContext, useEffect, useState } from 'react';
import Country from '@interfaces/Country';
const countries: Country[] = require('@res/countries').countries;

interface ICountryState{
    countries: Country[] | null
}

const defaultCountryState: ICountryState = {
    countries: countries
};

export const CountryContext: React.Context<ICountryState> = createContext<ICountryState>(defaultCountryState);

export default function CountryProvider({ children } : {children: React.ReactNode}){
    
    const [countryState, setCountryState] = useState<ICountryState>(defaultCountryState);

    useEffect(() => {
       setCountryState({ countries });
    }, []);

    return (
        <CountryContext.Provider value={countryState}>
            {children}
        </CountryContext.Provider>);
}