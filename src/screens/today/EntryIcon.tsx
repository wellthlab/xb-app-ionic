import React from 'react';
import { Box } from '@mui/joy';
import { Check } from 'phosphor-react';

import { useSelector } from '../../slices/store';
import { selectBoxFromExperiment, selectDayProgress } from '../../slices/experiments';
import getIcon from '../../utils/getIcon';

interface IDayIconProps {
    experimentId: string;
    dayId: number;
}

const EntryIcon = function ({ experimentId, dayId }: IDayIconProps) {
    const box = useSelector((state) => selectBoxFromExperiment(state, experimentId));
    const dayProgress = useSelector((state) => selectDayProgress(state, experimentId));
    const completed = dayProgress[dayId];

    const Icon = getIcon(box.icon);

    return (
        <Box
            bgcolor={completed ? 'success.solidBg' : 'neutral.solidBg'}
            width={36}
            height={36}
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius={18}
        >
            {completed ? <Check /> : <Icon />}
        </Box>
    );
};

export default EntryIcon;
