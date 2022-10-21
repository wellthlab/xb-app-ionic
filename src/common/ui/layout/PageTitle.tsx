import React from 'react';
import { Typography, TypographyProps } from '@mui/joy';

export interface IPageTitleProps extends TypographyProps {}

const PageTitle = function ({ sx, ...others }: IPageTitleProps) {
    return <Typography level="h2" component="h1" sx={{ mb: 4, ...sx }} {...others} />;
};

export default PageTitle;
