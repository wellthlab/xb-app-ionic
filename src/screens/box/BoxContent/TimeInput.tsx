import React from 'react';
import { Stack, Typography, FormLabel, FormControl, FormControlProps } from '@mui/joy';
import { ClickAwayListener } from '@mui/material';

import Select from '../../../components/foundation/Select';

interface ITimeInputProps extends Omit<FormControlProps, 'onChange'> {
    value?: string;
    onChange: (seconds: string) => void;
    label?: string;
}

const createTimeOptions = function (value: number) {
    return new Array(value).fill(0).map((_, i) => (i < 10 ? `0${i}` : i.toString()));
};

const TimeInput = function ({ value, onChange, label, ...others }: ITimeInputProps) {
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

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <FormControl {...others}>
                {label && <FormLabel>{label}</FormLabel>}
                <Stack level="h1" component={Typography} direction="row">
                    {portions.map((portion, portionId) => (
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
                            {portionId < 2 && ':'}
                        </React.Fragment>
                    ))}
                </Stack>
            </FormControl>
        </ClickAwayListener>
    );
};

export default TimeInput;
