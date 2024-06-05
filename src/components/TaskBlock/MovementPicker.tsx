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

import YouTubeVideo from './YoutubeVideo';
import { IMovementConfig } from '../../models/Experiment';

interface IMovementPickerProps extends RadioGroupProps {
    movements: IMovementConfig[];
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
                    {movements.map(({ name, video, desc }, index) => (
                        <Card key={index}>
                            <Radio value={name} label={name} />
                            <Collapse in={value === name}>
                                <Stack spacing={2}>
                                    {video && <YouTubeVideo src={video} sx={{ mt: 2 }} />}
                                    {desc && (
                                        <Typography level="body2" sx={{ mt: 2 }}>
                                            {desc}
                                        </Typography>
                                    )}
                                </Stack>
                            </Collapse>
                        </Card>
                    ))}
                </Stack>
            </RadioGroup>
        </FormControl>
    );
};

export default MovementPicker;
