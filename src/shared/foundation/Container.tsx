import React from 'react';
import { Container as JoyContainer, ContainerProps } from '@mui/joy';

const Container = function ({ sx, ...others }: ContainerProps) {
    return (
        <JoyContainer sx={{ py: 4, minHeight: '100%', display: 'flex', flexDirection: 'column', ...sx }} {...others} />
    );
};

export default Container;
