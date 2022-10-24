import React from 'react';
import { IonContent, IonModal } from '@ionic/react';
import { Alert, Button, Container } from '@mui/joy';

import Header from './Header';
import getErrorMessage from '../../utils/getErrorMessage';

export interface IModalProps extends React.ComponentProps<typeof IonModal> {
    headerTitle: string;
    onDismiss: () => void;
    actionButtonLabel?: string;
    onAction?: () => void;
}

const Modal = function ({ headerTitle, children, onDismiss, actionButtonLabel, onAction, ...others }: IModalProps) {
    const [pending, setPending] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string>();
    const handleAction = async function () {
        setPending(true);

        try {
            await onAction!();
        } catch (error) {
            setPending(false);
            console.log('Error in modal', error);
            return setErrorMessage(getErrorMessage(error, 'Sorry, something went wrong'));
        }

        onDismiss();
    };

    return (
        <IonModal canDismiss onDidDismiss={onDismiss} {...others}>
            <Header
                title={headerTitle}
                rightButton={
                    onAction && (
                        <Button variant="plain" disabled={pending} onClick={handleAction}>
                            {actionButtonLabel || 'Next'}
                        </Button>
                    )
                }
                leftButton={
                    <Button variant="plain" onClick={onDismiss}>
                        Close
                    </Button>
                }
            />

            <IonContent>
                <Container>
                    {errorMessage && (
                        <Alert color="danger" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}
                    {children}
                </Container>
            </IonContent>
        </IonModal>
    );
};

export default Modal;
