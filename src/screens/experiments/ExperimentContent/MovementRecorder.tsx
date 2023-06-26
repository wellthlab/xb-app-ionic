import React from 'react';
import { Button, Typography, Card, Stack, IconButton } from '@mui/joy';
import { Collapse } from '@mui/material';
import { Timer, Plus, CaretUp } from 'phosphor-react';

import MovementPicker from './MovementPicker';
import CountdownTimer from './CountdownTimer';

import { IMovementConfig } from '../../../models/Experiment';

interface IMovementRecorderProps {
    max: number;
    movements: IMovementConfig[];
    countdown: {
        duration: number;
        fixed?: boolean;
    };
}

const MovementCard = function ({
    movement,
    countdown,
}: {
    movement: string;
    countdown: IMovementRecorderProps['countdown'];
}) {
    const [showTimer, setShowTimer] = React.useState(true);

    const handleToggleTimer = function () {
        setShowTimer(!showTimer);
    };

    return (
        <Card>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography>{movement}</Typography>
                <Stack direction="row" spacing={1}>
                    <IconButton onClick={handleToggleTimer}>{!showTimer ? <Timer /> : <CaretUp />}</IconButton>
                </Stack>
            </Stack>
            <Collapse in={showTimer}>
                <CountdownTimer initialDuration={countdown.duration} fixed={countdown.fixed} />
            </Collapse>
        </Card>
    );
};

const MovementRecorder = function ({ max, movements, countdown }: IMovementRecorderProps) {
    const [movementsDone, setMovementsDone] = React.useState<[string, number][]>([]);
    const [addingMovement, setAddingMovement] = React.useState(false);
    const [tempMovement, setTempMovement] = React.useState('');

    const handleAddMovement = function () {
        setAddingMovement(true);
    };

    const handleCancelAddMovement = function () {
        setAddingMovement(false);
    };

    const handleChangeMovement = function (e: React.ChangeEvent<HTMLInputElement>) {
        setTempMovement(e.target.value);
    };

    const handleCommitMovement = function () {
        setMovementsDone([...movementsDone, [tempMovement, movementsDone.length]]);
        setTempMovement('');
        setAddingMovement(false);
    };

    return (
        <React.Fragment>
            <Typography>
                Click the button below to add a movement, then time yourself doing it. Or if you have done it in on your
                own, tap Next. Repeat 4 to 8 times if possible.
            </Typography>

            {movementsDone.map(([movement, id]) => (
                <MovementCard key={id} movement={movement} countdown={countdown} />
            ))}

            <Collapse in={addingMovement}>
                <Card sx={{ borderStyle: 'dashed', bgcolor: 'transparent', boxShadow: 'none' }}>
                    <Stack spacing={2}>
                        <MovementPicker
                            value={tempMovement}
                            onChange={handleChangeMovement}
                            label="What move do you want to do?"
                            movements={movements}
                        />
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button onClick={handleCancelAddMovement} size="sm" variant="outlined" color="danger">
                                Cancel
                            </Button>
                            <Button onClick={handleCommitMovement} size="sm" disabled={!tempMovement}>
                                Add
                            </Button>
                        </Stack>
                    </Stack>
                </Card>
            </Collapse>

            <Button onClick={handleAddMovement} sx={{ borderStyle: 'dashed', height: 80 }} fullWidth variant="outlined">
                <Plus />
            </Button>
        </React.Fragment>
    );
};

export default MovementRecorder;
