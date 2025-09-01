import Strings from '../../../utils/string_dict';
import { useLocation } from 'react-router-dom';
import React from 'react';
import { Box, Container } from '@mui/joy';

import Page from '../../../components/foundation/Page';
import PageTitle from '../../../components/foundation/PageTitle';

interface IAuthScreenLayout {
    children: React.ReactNode;
    title: string;
}

const AuthScreenLayout = function ({ children, title }: IAuthScreenLayout) {
    const location = useLocation();

    const backgroundGradients: Record<string, string> = {
        '/auth': 'linear-gradient(to right top, #f857a6, #ff5c90, #ff667b, #ff7468, #ff8358)',
        '/auth/register': 'linear-gradient(to right top, #fbc2eb 0%, #a6c1ee 100%)',
        '/auth/reset-password': 'linear-gradient(to top, #5ee7df 0%, #b490ca 100%)',
    };

    // Pick gradient based on current path, or fallback to default
    const background = backgroundGradients[location.pathname] || backgroundGradients.default;

    return (
        <Page
            disableGutters
            sx={{
                position: 'relative',
                m: 0,
                maxWidth: '100% !important',
                width: '100%',
                backgroundImage: `url(/assets/backgrounds/background_tile.svg), ${background}`,
                backgroundRepeat: 'repeat, no-repeat',
                backgroundSize: '300px, cover',
                backgroundPosition: 'top left, center',
                justifyContent: 'center',
                alignItems: 'center',
                animation: 'scrollBg 15s linear infinite',
                '@keyframes scrollBg': {
                    '0%': {
                        backgroundPosition: '0 0, center',
                    },
                    '100%': {
                        backgroundPosition: '300px 300px, center',
                    },
                },
            }}
        >
            <Container
                maxWidth="xs"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    height: 'auto', // Prevent full height
                    minHeight: 'unset',
                    alignSelf: 'center',
                    borderRadius: '10px',
                    boxShadow: '2px 4px 5px rgba(0,0,0,.3)',
                }}
            >
                <PageTitle sx={{ mb: 3 }}>{title}</PageTitle>
                {children}
            </Container>
        </Page>
    );
};

export default AuthScreenLayout;
