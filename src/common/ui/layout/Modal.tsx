import React from 'react';
import { IonContent, IonModal } from '@ionic/react';
import { Alert, Container } from '@mui/joy';

import Header from './Header';
import HeaderButton from './HeaderButton';
import getErrorMessage from '../../utils/getErrorMessage';

export interface IModalProps extends React.ComponentProps<typeof IonModal> {
    headerTitle: string;
    onDismiss: (reason: string) => void;
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

        onDismiss('action');
    };

    const handleDismiss: React.ComponentProps<typeof IonModal>['onDidDismiss'] = function (e) {
        if (e.detail.role === 'gesture') {
            onDismiss('gesture');
        }
    };

    const handleCancel = function () {
        onDismiss('cancel');
    };

    return (
        <IonModal canDismiss onWillDismiss={handleDismiss} {...others}>
            <Header
                title={headerTitle}
                rightButton={
                    onAction && (
                        <HeaderButton disabled={pending} onClick={handleAction}>
                            {actionButtonLabel || 'Next'}
                        </HeaderButton>
                    )
                }
                leftButton={<HeaderButton onClick={handleCancel}>Close</HeaderButton>}
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
