import React from 'react';
import { FormLabel, FormControl } from '@mui/joy';
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from 'dayjs';
export interface ISelectDateProps {
    label?: string;
    required?: boolean;
    onChange: (e: any) => void;
    value?: dayjs.Dayjs
}

const SelectDate = function ({
                             label,
                             required,
                            onChange,
                            value
                         }: ISelectDateProps) {
    return (
        <FormControl required={required}>
            {label && <FormLabel>{label}</FormLabel>}
            <DatePicker  slotProps={{ textField: { error: false, }, }} value={value} onChange={(event: any) => onChange(event.toISOString())} />
        </FormControl>
    )
};

export default SelectDate;
