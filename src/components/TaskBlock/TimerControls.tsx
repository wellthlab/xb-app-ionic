import React from 'react';
import { IconButton, Stack } from '@mui/joy';
import { ClockCounterClockwise, Pause, Play } from 'phosphor-react';

interface ITimerControlsProps {
    paused: boolean;
    onStart: () => void;
    onReset: () => void;
}

const TimerControls = function ({ paused, onStart, onReset }: ITimerControlsProps) {
    return (
        <Stack justifyContent="center" spacing={1} direction="row">
            <IconButton variant="solid" onClick={onStart}>
                {paused ? <Play /> : <Pause />}
            </IconButton>
            <IconButton variant="outlined" onClick={onReset}>
                <ClockCounterClockwise />
            </IconButton>
        </Stack>
    );
};

export default TimerControls;
