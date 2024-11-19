import React from 'react';
import { FormLabel, FormControl } from '@mui/joy';
import {DatePicker} from "@mui/x-date-pickers";

export interface ISelectDateProps {
    label?: string;
    required?: boolean;
    onChange: any;
}

const SelectDate = function ({
                             label,
                             required,
                            onChange
                         }: ISelectDateProps) {

    return (
        <FormControl required={required}>
            {label && <FormLabel>{label}</FormLabel>}
            <DatePicker onChange={(event) => console.log(event)} />
        </FormControl>
    )
};

export default SelectDate;
