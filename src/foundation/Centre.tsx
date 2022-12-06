import { Box, BoxProps } from '@mui/joy';
import React from 'react';

export interface ICentreProps extends BoxProps {
    children: React.ReactNode;
}

const Centre = function ({ children, sx }: ICentreProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                flexDirection: 'column',
                ...sx,
            }}
        >
            {children}
        </Box>
    );
};

export default Centre;
