import Strings from '../../utils/string_dict.js';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { CircularProgress, Alert } from '@mui/joy';

import AuthScreenLayout from './components/AuthScreenLayout';

import Centre from '../../components/foundation/Centre';
import useTokenAndTokenId from './hooks/useTokenAndTokenId';
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
        <AuthScreenLayout title={Strings.confirm_your_account}>
            {status === 'pending' ? (
                <Centre>
                    <CircularProgress />
                </Centre>
            ) : status === 'rejected' ? (
                <Alert color="danger">
                    {Strings.sorry_we_cannot_confirm_this}
                </Alert>
            ) : (
                <Alert color="success">{Strings.account_confirmed_you_can_now}</Alert>
            )}
        </AuthScreenLayout>
    );
};

export default ConfirmAccount;
