import React from 'react';
import { IonContent, IonModal } from '@ionic/react';
import { Container } from '@mui/joy';

import Header from './Header';
import HeaderButton from './HeaderButton';

export interface IModalProps extends React.ComponentProps<typeof IonModal> {
    headerTitle: string;
    onDismiss: (reason?: string) => void;
    actionButtonLabel?: string;
    onAction?: () => void;
}

const Modal = function ({ headerTitle, children, onDismiss, actionButtonLabel, onAction, ...others }: IModalProps) {
    const [pending, setPending] = React.useState(false);
    const handleAction = async function () {
        setPending(true);
        await onAction!();
        setPending(false);
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
                <Container>{children}</Container>
            </IonContent>
        </IonModal>
    );
};

export default Modal;
