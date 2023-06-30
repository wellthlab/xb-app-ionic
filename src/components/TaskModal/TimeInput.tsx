import React from 'react';
import { Stack, Typography, FormLabel, FormControl, FormControlProps, FormHelperText } from '@mui/joy';
import { ClickAwayListener } from '@mui/material';

import Select from '../foundation/Select';

interface ITimeInputProps extends Omit<FormControlProps, 'onChange'> {
    value?: string;
    onChange: (seconds: string) => void;
    label?: string;
    helperText?: string;
    hideSeconds?: boolean;
}

const createTimeOptions = function (value: number) {
    return new Array(value).fill(0).map((_, i) => (i < 10 ? `0${i}` : i.toString()));
};

const TimeInput = function ({ value, onChange, label, helperText, hideSeconds, ...others }: ITimeInputProps) {
    const actualValue = value || '00:00:00';
    const portions = actualValue.split(':');

    const [activePortion, setActivePortion] = React.useState(-1);

    const createHandleClickTimePortion = function (portionId: number) {
        return () => setActivePortion(portionId);
    };

    const createHandleChangePortion = function (portionId: number) {
        return (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newPortions = [...portions];
            newPortions[portionId] = e.target.value;
            onChange(newPortions.join(':'));
        };
    };

    const handleClickAway = function () {
        setActivePortion(-1);
    };

    const shownPortions = [portions[0], portions[1]];
    if (!hideSeconds) {
        shownPortions.push(portions[2]);
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <FormControl {...others} sx={{ alignItems: 'center' }}>
                {label && <FormLabel>{label}</FormLabel>}
                <Stack level="h1" component={Typography} direction="row">
                    {shownPortions.map((portion, portionId) => (
                        <React.Fragment key={portionId}>
                            {activePortion === portionId ? (
                                <Select
                                    sx={{
                                        width: 80,
                                        height: '100%',
                                        padding: 0,
                                        ' select': { textAlign: 'center' },
                                        ' svg': { display: 'none' },
                                    }}
                                    value={portions[portionId]}
                                    onChange={createHandleChangePortion(portionId)}
                                    options={createTimeOptions(portionId === 0 ? 24 : 60)}
                                />
                            ) : (
                                <span onClick={createHandleClickTimePortion(portionId)}>{portion}</span>
                            )}
                            {portionId < shownPortions.length - 1 && ':'}
                        </React.Fragment>
                    ))}
                </Stack>
                <FormHelperText>{helperText || 'Tap on the time display to adjust time'}</FormHelperText>
            </FormControl>
        </ClickAwayListener>
    );
};

export default TimeInput;
