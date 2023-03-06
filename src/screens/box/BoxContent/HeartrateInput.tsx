import React from 'react';
import { Typography, TextField, Box, TextFieldProps } from '@mui/joy';

import CountdownTimer from './CountdownTimer';

interface IHeartRateInputProps extends TextFieldProps {}

const HeartRateInput = function (props: IHeartRateInputProps) {
    return (
        <React.Fragment>
            <Typography level="body2">
                Find your pulse by firmly gripping your wrist like in the diagram below. Count your heartbeats for 20
                seconds. Then, multiply by 3.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box
                    component="img"
                    alt="Heart rate measure illustration"
                    src="/assets/heartrate.png"
                    sx={{ width: 160 }}
                />
            </Box>

            <CountdownTimer initialDuration={20} fixed />

            <TextField {...props} />
        </React.Fragment>
    );
};

export default HeartRateInput;
