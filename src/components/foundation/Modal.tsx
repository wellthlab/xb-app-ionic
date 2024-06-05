import Strings from '../../utils/string_dict.js';
import React from 'react';
import { IonContent, IonModal } from '@ionic/react';
import { Container } from '@mui/joy';

import Header from './Header';
import HeaderButton from './HeaderButton';
import { Tooltip } from '@mui/material';

export interface IModalProps extends React.ComponentProps<typeof IonModal> {
    headerTitle: string;
    onDismiss: (reason?: string) => void;
    actionButtonLabel?: string;
    actionButtonDisabled?: boolean;
    actionButtonDisabledToolTipTitle?: string;
    onAction?: () => void;
}

const Modal = function({
                           headerTitle,
                           children,
                           onDismiss,
                           actionButtonLabel,
                           actionButtonDisabled,
                           actionButtonDisabledToolTipTitle,
                           onAction,
                           ...others
                       }: IModalProps) {
    const [pending, setPending] = React.useState(false);
    const handleAction = async function() {
        setPending(true);
        await onAction!();
        setPending(false);
    };

    const handleDismiss: React.ComponentProps<typeof IonModal>['onDidDismiss'] = function(e) {
        if (e.detail.role === 'gesture') {
            onDismiss('gesture');
        }
    };

    const handleCancel = function() {
        onDismiss('cancel');
    };

    const actionButton =
        <HeaderButton disabled={pending || actionButtonDisabled} onClick={handleAction}>
            {actionButtonLabel || Strings.next}
        </HeaderButton>;

    return (
        <IonModal canDismiss onWillDismiss={handleDismiss} {...others}>
            <Header
                title={headerTitle}
                rightButton={
                    onAction && (
                        actionButtonDisabled ?
                            <Tooltip title={actionButtonDisabledToolTipTitle} enterTouchDelay={0} leaveDelay={10000} followCursor={true} arrow>
                            <span>
                                {actionButton}
                            </span>
                            </Tooltip> :
                            actionButton
                    )
                }
                leftButton={<HeaderButton onClick={handleCancel}>{Strings.close}</HeaderButton>}
            />

            <IonContent>
                <Container>{children}</Container>
            </IonContent>
        </IonModal>
    );
};

export default Modal;
