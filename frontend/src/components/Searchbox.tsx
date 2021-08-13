import React from 'react';
import TextField from '@material-ui/core/TextField';

import Search from '@material-ui/icons/Search';

interface ISearchboxProps {
    value: string,
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export default function Searchbox(props: ISearchboxProps){
    return (
    <TextField 
        variant="outlined" 
        value={props.value} 
        onChange={props.onChange}
        fullWidth
        InputProps={{
           startAdornment: <Search/>
        }}/>);
}