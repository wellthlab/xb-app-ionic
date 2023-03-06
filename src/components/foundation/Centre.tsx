import { Box, BoxProps } from '@mui/joy';
import React from 'react';

const Centre = function ({ children, sx }: BoxProps) {
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
