import React from 'react';
import { Box } from '@mui/joy';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';

interface IAuthScreenLayout {
    children: React.ReactNode;
    title: string;
}

const AuthScreenLayout = function ({ children, title }: IAuthScreenLayout) {
    return (
        <Page>
            <Box component="img" sx={{ width: 80, mb: 4 }} src="/assets/logo/logo.png" alt="XB App logo" />
            <PageTitle sx={{ mb: 3 }}>{title}</PageTitle>
            {children}
        </Page>
    );
};

export default AuthScreenLayout;
