import React from 'react';
import { Typography, TypographyProps } from '@mui/joy';

export interface ISectionTitleProps extends TypographyProps {}

const SectionTitle = function ({ sx, ...others }: ISectionTitleProps) {
    return <Typography level="h4" component="h2" sx={{ mb: 2, ...sx }} {...others} />;
};

export default SectionTitle;
