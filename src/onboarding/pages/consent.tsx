import React from 'react';
import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { Alert, Checkbox, Stack, Typography, Link, Button } from '@mui/joy';
import { useForm } from 'react-hook-form';

import { RouterLink } from '@/components/router-link';

export default function ConsentPage() {
    const { register, handleSubmit } = useForm();
    const [missing, setMissing] = React.useState(false);
    const router = useIonRouter();

    const onSubmit = handleSubmit((data) => {
        for (const key of Object.keys(data)) {
            if (!data[key]) {
                setMissing(true);
                return;
            }
        }

        setMissing(false);
        router.push('/onboarding/join-a-cohort');
    });

    return (
        <IonPage>
            <IonContent>
                <Stack component="form" spacing={5} sx={{ flex: 1 }} onSubmit={onSubmit}>
                    <div>
                        <RouterLink href="/onboarding/study" direction="backward" backIcon sx={{ mb: 2 }}>
                            Study information
                        </RouterLink>
                        <Typography level="h1">Just a few things...</Typography>
                    </div>

                    {missing && (
                        <Alert color="danger">You must give consent to every statement below before continuing</Alert>
                    )}

                    <Stack spacing={2} sx={{ flex: 1 }}>
                        <Checkbox
                            label="I have read the provided participant information and consent to take part in the study"
                            {...register('c1')}
                        />
                        <Checkbox
                            label="I am a member of staff or a student at the University of Southampton, and I am at least 18 years old."
                            {...register('c2')}
                        />
                        <Checkbox
                            label="I understand that I must be employed in a participating faculty or service, and that in some faculties or services I should discuss or raise participation with my line manager, as directed by my faculty or service."
                            {...register('c3')}
                        />

                        <Alert color="warning">
                            <Typography level="body-sm" sx={{ color: 'inherit' }}>
                                Exercise is safe and beneficial for most people, but some people should check with their
                                doctor before changing their physical activity patterns. Use the{' '}
                                <Link href="https://forms.office.com/r/gnYJRRAkRd" target="_blank">
                                    PAR Questionnaire
                                </Link>{' '}
                                and/or consult your GP before engaging in physical activity.
                            </Typography>
                        </Alert>

                        <Checkbox
                            label="I understand that physical activity can pose the risk of injury, and I have checked that it is safe for me to take part"
                            {...register('c4')}
                        />
                    </Stack>

                    <Button type="submit">Continue</Button>
                </Stack>
            </IonContent>
        </IonPage>
    );
}
