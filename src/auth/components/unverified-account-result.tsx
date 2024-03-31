import { Alert, Box, Link, Stack, Typography } from '@mui/joy';

import { useResendConfirmationEmail } from '../queries';

export type UnverifiedAccountResultProps = {
    email: string;
    backButton: React.ReactNode;
};

export function UnverifiedAccountResult({ email, backButton }: UnverifiedAccountResultProps) {
    const resendConfirmation = useResendConfirmationEmail();

    return (
        <Stack spacing={5} sx={{ flex: 1 }}>
            <Typography level="h1">Awaiting account verification</Typography>

            {resendConfirmation.isError && (
                <Alert color="danger">There was a problem sending you a confirmation email. Please try again</Alert>
            )}

            <Stack spacing={2} sx={{ flex: 1 }}>
                <Typography>
                    We have sent an email to {email}. Please follow the instructions to confirm your account.
                </Typography>
                <Typography>
                    Haven't heard from us?{' '}
                    <Link
                        component="button"
                        disabled={resendConfirmation.isPending}
                        onClick={() => resendConfirmation.mutate({ email })}
                    >
                        Resend code
                    </Link>
                </Typography>
            </Stack>

            {backButton}
        </Stack>
    );
}
