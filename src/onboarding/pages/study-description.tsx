import { IonContent, IonPage } from '@ionic/react';
import { Typography, Link, List, ListItem, Button, Box } from '@mui/joy';
import ReactMarkdown from 'react-markdown';

import { RouterLink } from '@/components/router-link';
import { Loading } from '@/components/loading';

import { useStudy } from '../queries';

export default function StudyDescriptionPage() {
    const { data: study, isPending, isError } = useStudy();
    if (isPending) {
        return <Loading />;
    }

    if (isError) {
        return <div>Error</div>;
    }

    return (
        <IonPage>
            <IonContent>
                <ReactMarkdown
                    children={study.desc}
                    components={{
                        h1: ({ children }) => (
                            <Typography level="h1" sx={{ mb: 1 }}>
                                {children}
                            </Typography>
                        ),
                        h2: ({ children }) => (
                            <Typography level="h2" sx={{ mt: 3, mb: 1 }}>
                                {children}
                            </Typography>
                        ),
                        p: ({ children }) => <Typography sx={{ mb: 2 }}>{children}</Typography>,
                        a: ({ children, href }) => <Link href={href}>{children}</Link>,
                        ol: ({ children }) => (
                            <List component="ol" marker="decimal" sx={{ mb: 2 }}>
                                {children}
                            </List>
                        ),
                        ul: ({ children }) => (
                            <List component="ul" marker="disc" sx={{ mb: 2 }}>
                                {children}
                            </List>
                        ),
                        li: ({ children }) => <ListItem>{children}</ListItem>,
                    }}
                />
            </IonContent>
            <Box sx={{ p: 2, borderTopWidth: '1px', borderTopStyle: 'solid', borderColor: 'divider' }}>
                <Button component={RouterLink} href="/onboarding/consent" fullWidth>
                    Continue
                </Button>
            </Box>
        </IonPage>
    );
}
