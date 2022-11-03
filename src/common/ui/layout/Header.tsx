import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonHeader, IonTitle, IonToolbar, IonButtons } from '@ionic/react';
import { Box, Typography } from '@mui/joy';

import HeaderButton from './HeaderButton';

interface IHeaderProps {
    title?: string;
    leftButton?: React.ReactNode;
    rightButton?: React.ReactNode;
}

const Header = function ({ title, leftButton, rightButton }: IHeaderProps) {
    const history = useHistory();

    const handleGoBack = function () {
        history.goBack();
    };

    return (
        <IonHeader>
            <Box component={IonToolbar} sx={{ paddingInline: 1 }}>
                <IonButtons slot="start">
                    {leftButton || <HeaderButton onClick={handleGoBack}>Back</HeaderButton>}
                </IonButtons>
                <IonTitle>
                    <Typography>{title}</Typography>
                </IonTitle>
                {rightButton && <IonButtons slot="end">{rightButton}</IonButtons>}
            </Box>
        </IonHeader>
    );
};

export default Header;
