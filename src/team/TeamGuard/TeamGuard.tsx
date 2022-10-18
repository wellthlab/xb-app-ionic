import React from 'react';
import { IonHeader, IonModal, IonContent, IonToolbar, IonTitle, IonButtons } from '@ionic/react';
import { Typography, Button, Stack, TextField, Container } from '@mui/joy';

import { Centre, Page } from '../../common/ui/layout';
import { selectTeam } from '../../common/slices/team';
import { useSelector } from '../../common/store';

interface ITeamGuardProps {
    children: React.ReactNode;
}

const TeamGuard = function ({ children }: ITeamGuardProps) {
    const team = useSelector(selectTeam);

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();
    const [modalOpen, setModalOpen] = React.useState(false);

    const handleOpenModal = function () {
        setModalOpen(true);
    };

    return (
        <Page ref={setPresentingElement} sx={{ display: 'flex', flexDirection: 'column' }}>
            {team ? (
                children
            ) : (
                <React.Fragment>
                    <Centre>
                        <Stack spacing={2}>
                            <Typography level="h6" component="p">
                                You are currently not in a team
                            </Typography>
                            <Button onClick={handleOpenModal}>Join</Button>
                            <Typography level="body3" textAlign="center">
                                Or
                            </Typography>
                            <Button variant="outlined">Create one</Button>
                        </Stack>
                    </Centre>

                    <IonModal isOpen={modalOpen} presentingElement={presentingElement}>
                        <IonHeader>
                            <IonToolbar>
                                <IonTitle>
                                    <Typography>Join a team</Typography>
                                </IonTitle>
                                <IonButtons slot="end">
                                    <Button variant="plain">Next</Button>
                                </IonButtons>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent>
                            <Container sx={{ py: 4 }}>
                                <TextField label="Invite code" placeholder="AB12345" />
                            </Container>
                        </IonContent>
                    </IonModal>
                </React.Fragment>
            )}
        </Page>
    );
};

export default TeamGuard;
