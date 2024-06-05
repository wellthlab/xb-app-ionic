import Strings from '../../utils/string_dict';
import React from 'react';
import { Typography, Stack } from '@mui/joy';

import TimeInput from './TimeInput';
import TimerControls from './TimerControls';

interface ICountdownTimerProps {
    initialDuration: number;
    fixed?: boolean;
    notifications?: number[];
}

const displayTime = function (seconds: number) {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substring(11, 19);
};

const CountdownTimer = function ({ initialDuration = 0, fixed, notifications }: ICountdownTimerProps) {
    const duration = React.useRef(initialDuration);
    const [seconds, setSeconds] = React.useState(initialDuration);
    const [paused, setPaused] = React.useState(true);
    const callbackRef = React.useRef<() => void>();
    const indextime = React.useRef(0);
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
            if (!notifications) {
                return;
            }

            if (indextime.current < notifications.length && seconds - 1 <= notifications[indextime.current]) {
                console.log(Strings.a_minute_has_passed);
                var audio = new Audio('/assets/beep-09.mp3');
                audio.play();
                indextime.current = indextime.current + 1;
            }
        };
    });

    const handleStartOrStopCountdown = function () {
        setPaused(!paused);
    };

    const handleResetCountdown = function () {
        setPaused(true);
        setSeconds(duration.current);
        indextime.current = 0;
    };

    const handleChangeDuration = function (time: string) {
        setPaused(true);
        indextime.current = 0;

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
