import React from 'react';
import { Redirect } from 'react-router-dom';
import { CircularProgress, Alert } from '@mui/joy';

import AuthScreenLayout from './AuthScreenLayout';

import Centre from '../../components/foundation/Centre';
import useTokenAndTokenId from '../../hooks/useTokenAndTokenId';
import Account from '../../models/Account';

const ConfirmAccount = function () {
    const { token, tokenId } = useTokenAndTokenId();

    const [status, setStatus] = React.useState('pending');

    React.useEffect(() => {
        if (!token || !tokenId) {
            return;
        }

        const confirm = async function () {
            try {
                await Account.confirmAccount(token, tokenId);
            } catch (error) {
                setStatus('rejected');
                console.log(error);
                return;
            }

            setStatus('fulfilled');
        };

        confirm();
    }, []);

    if (!token || !tokenId) {
        return <Redirect to="/auth" />;
    }

    return (
        <AuthScreenLayout title="Confirm your account">
            {status === 'pending' ? (
                <Centre>
                    <CircularProgress />
                </Centre>
            ) : status === 'rejected' ? (
                <Alert color="danger">
                    Sorry, we cannot confirm this account. You have either confirmed your account, or have waited too
                    long to confirm this email. Please login with your registered credentials and follow the
                    instructions.
                </Alert>
            ) : (
                <Alert color="success">Account confirmed. You can now continue in the app</Alert>
            )}
        </AuthScreenLayout>
    );
};

export default ConfirmAccount;
