import React from 'react';
import { Button, ButtonProps } from '@mui/joy';

const HeaderButton = function ({ sx, ...others }: ButtonProps) {
    return <Button variant="plain" sx={{ paddingInline: 0, ...sx }} {...others} />;
};

export default HeaderButton;
