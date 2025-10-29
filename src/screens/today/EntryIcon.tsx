import React from 'react';
import { Box } from '@mui/joy';

import { useSelector } from '../../slices/store';
import { selectBoxByExperimentId } from '../../slices/experiments';
import getIcon from '../../utils/getIcon';
import { Cube as BoxIcon } from 'phosphor-react';

interface IDayIconProps {
    experimentId: string;
    dayNum: number;
}

const EntryIcon = function ({ experimentId, dayNum }: IDayIconProps) {
    const box = useSelector((state) => selectBoxByExperimentId(state, experimentId));

    const Icon = box?.icon ? getIcon(box.icon) : BoxIcon;

    return (
        <Box
            bgcolor="neutral.solidBg"
            color="grey.50"
            width={36}
            height={36}
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius={18}
        >
            <Icon />
        </Box>
    );
};

export default EntryIcon;
