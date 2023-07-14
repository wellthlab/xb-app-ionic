import React from 'react';
import { Check, PencilSimple } from 'phosphor-react';
import { Box } from '@mui/joy';

import { useSelector } from '../../slices/store';
import { selectDayProgress } from '../../slices/experiments';

interface IDayIconProps {
    experimentId: string;
    dayId: number;
}

const EntryIcon = function ({ experimentId, dayId }: IDayIconProps) {
    const dayProgress = useSelector((state) => selectDayProgress(state, experimentId));
    const completed = dayProgress[dayId];

    return (
        <Box
            bgcolor={completed ? 'success.solidBg' : 'neutral.solidBg'}
            color="grey.50"
            width={36}
            height={36}
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius={18}
        >
            {completed ? <Check /> : <PencilSimple />}
        </Box>
    );
};

export default EntryIcon;
