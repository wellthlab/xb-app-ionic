import { RouterLink } from '@/components/router-link';
import { IonContent, IonPage } from '@ionic/react';
import { Box, Card, Stack, Typography } from '@mui/joy';
import { User, UsersThree } from '@phosphor-icons/react';
import { CaretRight } from '@phosphor-icons/react/dist/ssr';

const options = [
    {
        icon: UsersThree,
        type: 'cohort',
        label: 'Join with a cohort link',
        desc: 'Use the link provided by a researcher to join your cohort',
    },
    {
        icon: User,
        type: 'individual',
        label: 'Join as an individual',
        desc: 'Do experiments at your own pace',
    },
];

export default function JoinACohortPage() {
    return (
        <IonPage>
            <IonContent>
                <Box sx={{ mb: 5 }}>
                    <RouterLink href="/onboarding/consent" direction="backward" backIcon sx={{ mb: 2 }}>
                        Consent
                    </RouterLink>
                    <Typography level="h1" sx={{ mb: 1 }}>
                        Join a cohort
                    </Typography>
                    <Typography>Select an option below to continue</Typography>
                </Box>

                <Stack sx={{ flex: 1, gap: 2 }}>
                    {options.map(({ type, icon: Icon, label, desc }) => (
                        <Card
                            variant="outlined"
                            orientation="horizontal"
                            key={type}
                            sx={{ alignItems: 'center', ':hover': { bgcolor: 'neutral.outlinedHoverBg' } }}
                        >
                            <Icon size={24} />

                            <RouterLink
                                href={`/onboarding/${type}`}
                                overlay
                                underline="none"
                                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', flex: 1 }}
                            >
                                <Typography level="body-md">{label}</Typography>
                                <Typography level="body-sm">{desc}</Typography>
                            </RouterLink>

                            <CaretRight size={24} />
                        </Card>
                    ))}
                </Stack>
            </IonContent>
        </IonPage>
    );
}
