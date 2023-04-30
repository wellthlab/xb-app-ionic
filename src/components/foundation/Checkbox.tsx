import React from 'react';
import { Checkbox as JoyCheckbox, CheckboxProps, FormHelperText, FormControl } from '@mui/joy';

export interface ICheckboxProps extends CheckboxProps {
    error?: boolean;
    helperText?: string;
}

const Checkbox = function ({ error, helperText, ...others }: ICheckboxProps) {
    return (
        <FormControl error={error}>
            <JoyCheckbox {...others} />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default Checkbox;
