import React from 'react';
import { FormLabel, FormHelperText, Textarea as MuiTextarea, TextareaProps } from '@mui/joy';
import FormControl from '@mui/joy/FormControl';

export interface ITextareaProps extends TextareaProps {
    label?: string;
    helperText?: string;
}

const Textarea = function ({ label, helperText, error, ...props }: ITextareaProps) {
    return (
        <FormControl error={error}>
            {label && <FormLabel>{label}</FormLabel>}
            <MuiTextarea {...props} />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default Textarea;
