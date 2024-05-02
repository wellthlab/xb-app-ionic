import Strings from '../../../utils/string_dict.js';
import React from 'react';
import { Link, Alert, Button, Stack, ButtonProps } from '@mui/joy';

import Account from '../../../models/Account';

interface IConfirmationRequiredProps {
    onClickLoginLink: ButtonProps['onClick'];
    email: string;
}

const ConfirmationRequired = function ({ email, onClickLoginLink }: IConfirmationRequiredProps) {
    const handleResendEmail = function () {
        Account.resendConfirmationEmail(email);
    };

    return (
        <Stack spacing={2}>
            <Alert>{Strings.we_have_sent_you_an_email_to}</Alert>
            <Button onClick={handleResendEmail}>{Strings.resend_confirmation_email}</Button>
            <Link component="button" level="body2" onClick={onClickLoginLink}>
                {Strings.confirmed_login}
            </Link>
        </Stack>
    );
};

export default ConfirmationRequired;
