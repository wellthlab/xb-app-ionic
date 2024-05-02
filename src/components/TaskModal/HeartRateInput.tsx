import Strings from '../../utils/string_dict.js';
import React from 'react';
import { Typography, TextField, Box, TextFieldProps } from '@mui/joy';

import CountdownTimer from './CountdownTimer';

interface IHeartRateInputProps extends TextFieldProps {}

const HeartRateInput = function (props: IHeartRateInputProps) {
    return (
        <React.Fragment>
            <Typography level="body2">
                {Strings.find_your_pulse_by_firmly}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box
                    component="img"
                    alt={Strings.heart_rate_measure}
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
