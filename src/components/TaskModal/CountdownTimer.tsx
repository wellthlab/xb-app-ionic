import React from 'react';
import { Typography, IconButton, Stack } from '@mui/joy';
import { Play, ClockCounterClockwise, Pause } from 'phosphor-react';

import TimeInput from './TimeInput';
import TimerControls from './TimerControls';

interface ICountdownTimerProps {
    initialDuration: number;
    fixed?: boolean;
}

const displayTime = function (seconds: number) {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substring(11, 19);
};

const CountdownTimer = function ({ initialDuration = 0, fixed }: ICountdownTimerProps) {
    const duration = React.useRef(initialDuration);
    const [seconds, setSeconds] = React.useState(initialDuration);
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
            if (seconds <= 0) {
                return handleResetCountdown();
            }

            setSeconds(seconds - 1);
        };
    });

    const handleStartOrStopCountdown = function () {
        setPaused(!paused);
    };

    const handleResetCountdown = function () {
        setPaused(true);
        setSeconds(duration.current);
    };

    const handleChangeDuration = function (time: string) {
        setPaused(true);

        const portions = time.split(':');
        const newDuration = Number(portions[0]) * 3600 + Number(portions[1]) * 60 + Number(portions[2]);
        setSeconds(newDuration);
        duration.current = newDuration;
    };

    const handleStopCountdown = function () {
        setPaused(true);
    };

    const displayedTime = displayTime(seconds);

    return (
        <Stack spacing={1}>
            {fixed ? (
                <Typography textAlign="center" level="h1" component="p">
                    {displayedTime}
                </Typography>
            ) : (
                <TimeInput value={displayedTime} onChange={handleChangeDuration} onClick={handleStopCountdown} />
            )}

            <TimerControls paused={paused} onStart={handleStartOrStopCountdown} onReset={handleResetCountdown} />
        </Stack>
    );
};

export default CountdownTimer;
