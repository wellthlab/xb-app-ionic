import React from 'react';
import {
    Card,
    FormControl,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
    RadioGroupProps,
    Stack,
    Typography,
} from '@mui/joy';
import { Collapse } from '@mui/material';

interface IMovementPickerProps extends RadioGroupProps {
    movements: [string, string][];
    label?: string;
    helperText?: string;
    error?: boolean;
}

const MovementPicker = function ({ movements, label, value, helperText, error, ...others }: IMovementPickerProps) {
    return (
        <FormControl error={error}>
            {label && <FormLabel>{label}</FormLabel>}
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
            <RadioGroup value={value} {...others}>
                <Stack spacing={1}>
                    {movements.map(([movement, explanation], index) => (
                        <Card key={index}>
                            <Radio value={movement} label={movement} />
                            <Collapse in={value === movement}>
                                <Typography level="body2" sx={{ mt: 2 }}>
                                    {explanation}
                                </Typography>
                            </Collapse>
                        </Card>
                    ))}
                </Stack>
            </RadioGroup>
        </FormControl>
    );
};

export default MovementPicker;
