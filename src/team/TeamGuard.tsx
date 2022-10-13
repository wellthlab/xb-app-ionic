import React from 'react';
import { IonModal } from '@ionic/react';
import { Typography, Button, Stack } from '@mui/joy';

import { Page } from '../common/page';
import { selectTeam } from '../state/team';
import { useSelector } from '../store';
import { Centre } from '../common/layout';

interface ITeamGuardProps {
    children: React.ReactNode;
}

const TeamGuard = function ({ children }: ITeamGuardProps) {
    const team = useSelector(selectTeam);

    const modalRef = React.useRef<HTMLIonModalElement>(null);

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();

    return (
        <Page ref={setPresentingElement} sx={{ display: 'flex', flexDirection: 'column' }}>
            {team ? (
                children
            ) : (
                <React.Fragment>
                    <Centre sx={{ flex: 1 }}>
                        <Stack spacing={2}>
                            <Typography level="h6" component="p">
                                You are currently not in a team
                            </Typography>
                            <Button id="join-moodal-button">Join</Button>
                            <Typography level="body3" textAlign="center">
                                Or
                            </Typography>
                            <Button variant="outlined">Create one</Button>
                        </Stack>
                    </Centre>

                    <IonModal ref={modalRef} trigger="join-moodal-button" presentingElement={presentingElement}>
                        Test
                    </IonModal>
                </React.Fragment>
            )}
        </Page>
    );
};

export default TeamGuard;
