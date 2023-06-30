import React from 'react';
import { Typography, IconButton, Stack } from '@mui/joy';
import { Play, ClockCounterClockwise, Pause } from 'phosphor-react';

import TimeInput from './TimeInput';

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
        setSeconds(duration.current);
    };

    const handleChangeDuration = function (time: string) {
        setIsRunning(false);

        const portions = time.split(':');
        const newDuration = Number(portions[0]) * 3600 + Number(portions[1]) * 60 + Number(portions[2]);
        setSeconds(newDuration);
        duration.current = newDuration;
    };

    const handleStopCountdown = function () {
        setIsRunning(false);
    };

    const displayedTime = displayTime(seconds);

    return (
        <Stack alignItems="center" spacing={1}>
            {fixed ? (
                <Typography level="h1" component="p">
                    {displayedTime}
                </Typography>
            ) : (
                <TimeInput value={displayedTime} onChange={handleChangeDuration} onClick={handleStopCountdown} />
            )}
            <Stack spacing={1} direction="row">
                <IconButton variant="solid" onClick={handleStartOrStopCountdown}>
                    {isRunning ? <Pause /> : <Play />}
                </IconButton>
                <IconButton variant="outlined" onClick={handleResetCountdown}>
                    <ClockCounterClockwise />
                </IconButton>
            </Stack>
        </Stack>
    );
};

export default CountdownTimer;
