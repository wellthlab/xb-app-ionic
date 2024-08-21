import Strings from '../../utils/string_dict.js';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonHeader, IonTitle, IonToolbar, IonButtons } from '@ionic/react';
import { Box, Typography } from '@mui/joy';

import HeaderButton from './HeaderButton';

export interface IHeaderProps extends React.ComponentPropsWithoutRef<typeof IonHeader> {
    title?: string;
    leftButton?: React.ReactNode;
    rightButton?: React.ReactNode;
    rightSlot?: React.ReactNode;
}

const Header = function ({ title, leftButton, rightButton, rightSlot, ...others }: IHeaderProps) {
    const history = useHistory();

    const handleGoBack = function () {
        history.goBack();
    };

    return (
        <IonHeader translucent {...others}>
            <Box component={IonToolbar} sx={{ paddingInline: 1 }}>
                <IonButtons slot="start">
                    {leftButton || <HeaderButton onClick={handleGoBack}>{Strings.back}</HeaderButton>}
                </IonButtons>
                <IonTitle>
                    <Typography>{title}</Typography>
                </IonTitle>
                {rightSlot && <div slot="end">{rightSlot}</div>}
                {rightButton && <IonButtons slot="end">{rightButton}</IonButtons>}
            </Box>
        </IonHeader>
    );
};

export default Header;
