import React from 'react';
import { FormControl, FormHelperText, FormLabel, Slider as JoySlider, SliderProps } from '@mui/joy';

interface ISliderProps extends SliderProps {
    label?: string;
    helperText?: string;
    error?: boolean;
}

const Slider = function ({ label, helperText, error, ...others }: ISliderProps) {
    return (
        <FormControl error={error}>
            {label && <FormLabel>{label}</FormLabel>}
            <JoySlider {...others} />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default Slider;
