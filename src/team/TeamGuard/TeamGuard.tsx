import React from 'react';
import { Typography, Button, Stack, TextField } from '@mui/joy';

import { Centre, Page, Modal } from '../../common/ui/layout';
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

                    <Modal title="Join a team" isOpen={modalOpen} presentingElement={presentingElement}>
                        <TextField label="Invite code" placeholder="AB12345" />
                    </Modal>
                </React.Fragment>
            )}
        </Page>
    );
};

export default TeamGuard;
