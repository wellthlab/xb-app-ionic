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
            <Alert>We have sent you an email to confirm your account</Alert>
            <Button onClick={handleResendEmail}>Resend confirmation email</Button>
            <Link component="button" level="body2" onClick={onClickLoginLink}>
                {Strings.confirmed_login}
            </Link>
        </Stack>
    );
};

export default ConfirmationRequired;
