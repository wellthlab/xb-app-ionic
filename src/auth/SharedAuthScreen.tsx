import React from 'react';
import { Box } from '@mui/joy';

import { Page, PageTitle } from '../common/page';

interface ISharedAuthScreenProps {
    children: React.ReactNode;
    title: string;
}

const SharedAuthScreen = function ({ children, title }: ISharedAuthScreenProps) {
    return (
        <Page>
            <Box component="img" sx={{ width: 80, mb: 4 }} src="/assets/logo/logo.png" alt="XB App logo" />
            <PageTitle sx={{ mb: 3 }}>{title}</PageTitle>
            {children}
        </Page>
    );
};

export default SharedAuthScreen;
