import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import { Typography, Button } from '@mui/joy';

export interface IHeaderProps {
    title?: string;
    dismissButton?: React.ReactNode;
}

const Header = function ({ title, dismissButton }: IHeaderProps) {
    const history = useHistory();

    const handleGoBack = function () {
        history.goBack();
    };

    return (
        <IonHeader>
            <IonToolbar>
                {dismissButton || (
                    <Button variant="plain" onClick={handleGoBack}>
                        Back
                    </Button>
                )}
                <IonTitle>
                    <Typography>{title}</Typography>
                </IonTitle>
            </IonToolbar>
        </IonHeader>
    );
};

export default Header;
