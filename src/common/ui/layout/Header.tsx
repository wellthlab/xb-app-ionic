import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonHeader, IonTitle, IonToolbar, IonButtons } from '@ionic/react';
import { Typography, Button } from '@mui/joy';

export interface IHeaderProps {
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
            <IonToolbar>
                <IonButtons slot="start">
                    {leftButton || (
                        <Button variant="plain" onClick={handleGoBack}>
                            Back
                        </Button>
                    )}
                </IonButtons>
                <IonTitle>
                    <Typography>{title}</Typography>
                </IonTitle>
                {rightButton ? <IonButtons slot="end">{rightButton}</IonButtons> : null}
            </IonToolbar>
        </IonHeader>
    );
};

export default Header;
