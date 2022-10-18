import React from 'react';
import { IonContent, IonTitle, IonHeader, IonModal, IonButtons, IonToolbar } from '@ionic/react';
import { Button, Typography, Container } from '@mui/joy';

export interface IModalProps extends React.ComponentProps<typeof IonModal> {
    dismissLabel?: string;
}

const Modal = function ({ title, dismissLabel, children, ...others }: IModalProps) {
    return (
        <IonModal {...others}>
            <IonContent>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>
                            <Typography>{title}</Typography>
                        </IonTitle>
                        <IonButtons>
                            <Button variant="plain">{dismissLabel || 'Close'}</Button>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <Container>{children}</Container>
                </IonContent>
            </IonContent>
        </IonModal>
    );
};

export default Modal;
