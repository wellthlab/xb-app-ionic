import React from 'react';
import { FormLabel, FormHelperText, Textarea as MuiTextarea, TextareaProps, FormControl } from '@mui/joy';

export interface ITextareaProps extends TextareaProps {
    label?: string;
    helperText?: string;
}

const Textarea = function ({ label, helperText, error, ...props }: ITextareaProps) {
    return (
        <FormControl error={error}>
            {label && <FormLabel>{label}</FormLabel>}
            <br/>
            <MuiTextarea {...props} />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default Textarea;
