import React from 'react';
import { Stack, Typography } from '@mui/joy';

import TimerControls from './TimerControls';

interface IStopwatchProps {
    value: number;
    onChange: (value: number) => void;
    helperText?: string;
    error?: boolean;
}

const displayTime = function (seconds: number) {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substring(11, 19);
};

const Stopwatch = function ({ value, onChange, helperText, error }: IStopwatchProps) {
    const [paused, setPaused] = React.useState(true);
    const callbackRef = React.useRef<() => void>();

    React.useEffect(() => {
        if (paused) {
            return;
        }

        let interval = setInterval(() => {
            callbackRef.current?.();
        }, 1000);

        return () => clearInterval(interval);
    }, [paused]);

    React.useEffect(() => {
        callbackRef.current = function () {
            onChange(value + 1);
        };
    });

    const handleStartOrStopCountdown = function () {
        setPaused(!paused);
    };

    const handleResetCountdown = function () {
        setPaused(true);
        onChange(0);
    };

    const displayedTime = displayTime(value);

    return (
        <Stack spacing={1}>
            <Typography textAlign="center" level="h1" component="p">
                {displayedTime}
            </Typography>

            {helperText && (
                <Typography textAlign="center" color={error ? 'danger' : undefined} level="body2">
                    {helperText}
                </Typography>
            )}

            <TimerControls paused={paused} onStart={handleStartOrStopCountdown} onReset={handleResetCountdown} />
        </Stack>
    );
};

export default Stopwatch;
