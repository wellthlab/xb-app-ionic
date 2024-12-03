import React from 'react';
import {
    FormControl,
    FormHelperText,
    FormLabel,
} from '@mui/joy';
import { FormControlLabel } from '@mui/material';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
interface IRadioGroupProps  {
    error?: boolean;
    options: readonly string[];
    required?: boolean;
    label?: string;
    helperText?: string;
    onChange:(event: React.SyntheticEvent, checked: boolean) => void;
}
const RadioGroupXB = function ({ error, options, required, label, helperText,onChange }: IRadioGroupProps) {
    return (
        <FormControl error={error} required={required}>
            <FormLabel>{label}</FormLabel>
            <RadioGroup row>
                {options.map((option) => (
                    <FormControlLabel slotProps={{ typography: {sx: { fontSize: '0.8rem' }} }} onChange={onChange} value={option} name={option} control={<Radio />} label={option} />

                ))}
            </RadioGroup>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>);
};
export default RadioGroupXB;


