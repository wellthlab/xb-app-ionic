import React from 'react';
import { Checkbox as JoyCheckbox, CheckboxProps, FormHelperText, FormControl } from '@mui/joy';

export interface ICheckboxProps extends CheckboxProps {
    error?: boolean;
    helperText?: string;
    isAboutPage?: boolean;
}

const Checkbox = function ({ error, helperText, isAboutPage, ...others }: ICheckboxProps) {
    const disabled = isAboutPage;

    return (
        <FormControl error={error}>
            <JoyCheckbox disabled ={disabled} {...others} />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default Checkbox;
