
import React from 'react';
import {TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

const IconTextField = ({endIcon, startIcon, ...props}) => {

  
  const startAdornment = !!startIcon ? {
    startAdornment: <InputAdornment position="start">
     {startIcon}
    </InputAdornment>,
  } : null;

  const endAdornment = !!endIcon ? {
    endAdornment: <InputAdornment position="end">
     {endIcon}
    </InputAdornment>,
  } : null;


  return <TextField 
    size="small"
    autoComplete="off"
    InputProps={ startAdornment, endAdornment }
    {...props}
    />
}

export default IconTextField;
