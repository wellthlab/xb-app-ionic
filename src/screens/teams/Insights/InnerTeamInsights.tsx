import React from 'react';
import { useIonAlert } from '@ionic/react';
import { Card, Button, Typography, Stack, Chip, Box } from '@mui/joy';
import { Users, Fingerprint } from 'phosphor-react';

import Page from '../../../components/foundation/Page';
import PageTitle from '../../../components/foundation/PageTitle';
import Modal from '../../../components/foundation/Modal';
import Centre from '../../../components/foundation/Centre';
import SectionTitle from '../../../components/foundation/SectionTitle';

import { selectFullName, selectUserId } from '../../../slices/account';
import { leaveTeam, selectTeam } from '../../../slices/team';
import { useSelector, useDispatch } from '../../../slices/store';

const InnerTeamInsights = function () {
    const fullName = useSelector(selectFullName);
    const userId = useSelector(selectUserId);
    const team = useSelector(selectTeam)!;

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();

    const [leaderboardOpen, setLeaderboardOpen] = React.useState(false);
    const createModalHandler = function (value: boolean) {
        return () => setLeaderboardOpen(value);
    };

    const dispatch = useDispatch();
    const [presentAlert] = useIonAlert();

    const handleLeaveTeam = function () {
        presentAlert({
            header: 'Are you sure?',
            subHeader: 'You will be able to join this team again',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'OK',
                    role: 'confirm',
                    handler: () => dispatch(leaveTeam()),
                },
            ],
        });
    };

    return (
        <Page ref={setPresentingElement}>
            <PageTitle>Welcome, {fullName}</PageTitle>
            <Card sx={{ mb: 4 }}>
                <Typography level="h5" sx={{ mb: 1 }}>
                    {team.name}
                </Typography>
                <Typography level="body2" sx={{ mb: 3 }}>
                    {team.desc || 'No description'}
                </Typography>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                        <Users />
                        <Typography>{team.members.length} member(s)</Typography>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        <Fingerprint />
                        <Typography>{team.invite}</Typography>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                        <Button fullWidth onClick={createModalHandler(true)}>
                            Leaderboard
                        </Button>
                        <Button variant="outlined" color="danger" onClick={handleLeaveTeam} fullWidth>
                            Leave team
                        </Button>
                    </Stack>
                </Stack>
            </Card>

            <SectionTitle>Members</SectionTitle>

            <Stack spacing={1}>
                {team.members.map(({ id, profile }) => (
                    <Card key={id}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>
                                {profile.firstName} {profile.lastName}
                            </Typography>

                            <Stack direction="row" spacing={1}>
                                {id === userId ? (
                                    <Chip color="info" size="sm">
                                        You
                                    </Chip>
                                ) : null}

                                {id === team.members[0].id ? (
                                    <Chip color="success" size="sm">
                                        Owner
                                    </Chip>
                                ) : null}
                            </Stack>
                        </Box>
                        <Typography level="body3">{profile.department}</Typography>
                    </Card>
                ))}
            </Stack>

            <Modal
                headerTitle="Teams leaderboard"
                isOpen={leaderboardOpen}
                presentingElement={presentingElement}
                onDismiss={createModalHandler(false)}
            >
                <Centre>
                    <Typography>This feature is coming soon</Typography>
                    <Typography>Stay tuned</Typography>
                </Centre>
            </Modal>
        </Page>
    );
};

export default InnerTeamInsights;
