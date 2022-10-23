import React from 'react';
import { Typography, TextField, Box, TextFieldProps, IconButton, Stack } from '@mui/joy';
import { Play, ClockCounterClockwise, Pause } from 'phosphor-react';

interface IHeartrateInputProps extends TextFieldProps {}

const INITIAL_TIME = 20; // 20 seconds

const displayTime = function (seconds: number) {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substring(11, 19);
};

const HeartrateInput = function (props: IHeartrateInputProps) {
    const [seconds, setSeconds] = React.useState(INITIAL_TIME);
    const [isRunning, setIsRunning] = React.useState(false);
    const callbackRef = React.useRef<() => void>();

    React.useEffect(() => {
        if (!isRunning) {
            return;
        }

        let interval = setInterval(() => {
            callbackRef.current?.();
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    React.useEffect(() => {
        callbackRef.current = function () {
            if (seconds <= 0) {
                return handleResetCountdown();
            }

            setSeconds(seconds - 1);
        };
    });

    const handleStartOrStopCountdown = function () {
        setIsRunning(!isRunning);
    };

    const handleResetCountdown = function () {
        setIsRunning(false);
        setSeconds(INITIAL_TIME);
    };

    return (
        <React.Fragment>
            <Typography level="body2">
                Find your pulse by firmly gripping your wrist like in the diagram below. Count your heartbeats for 20
                seconds. Then, multiply by 3.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box
                    component="img"
                    alt="Heartrate measure illustration"
                    src="/assets/heartrate.png"
                    sx={{ width: 160 }}
                />
            </Box>

            <Stack sx={{ alignItems: 'center' }} spacing={1}>
                <Typography level="h1">{displayTime(seconds)}</Typography>
                <Stack spacing={1} direction="row">
                    <IconButton variant="solid" onClick={handleStartOrStopCountdown}>
                        {isRunning ? <Pause /> : <Play />}
                    </IconButton>
                    <IconButton variant="outlined" onClick={handleResetCountdown}>
                        <ClockCounterClockwise />
                    </IconButton>
                </Stack>
            </Stack>

            <TextField {...props} />
        </React.Fragment>
    );
};

export default HeartrateInput;
