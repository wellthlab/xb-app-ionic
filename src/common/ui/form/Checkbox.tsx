import React from 'react';
import { Checkbox as JoyCheckbox, CheckboxProps, FormHelperText } from '@mui/joy';
import FormControl from '@mui/joy/FormControl';

export interface ICheckboxProps extends CheckboxProps {
    error?: boolean;
    helperText?: string;
}

const Checkbox = function ({ color, error, helperText, ...others }: ICheckboxProps) {
    return (
        <FormControl color={error ? 'danger' : color}>
            <JoyCheckbox {...others} />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default Checkbox;
