import React from 'react';
import { Checkbox as JoyCheckbox, CheckboxProps, FormHelperText, FormControl } from '@mui/joy';

export interface ICheckboxProps extends CheckboxProps {
    error?: boolean;
    helperText?: string;
    isEnrolled?: boolean;
}

const Checkbox = function ({ error, helperText, isEnrolled, ...others }: ICheckboxProps) {
    const disabled = isEnrolled;
    let {checked, ...otherProps} = others;

    return (
        <FormControl error={error}>
            <JoyCheckbox disabled ={disabled} checked={checked} {...otherProps} />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default Checkbox;
