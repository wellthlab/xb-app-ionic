import React from 'react';
import { Card, Button, Typography, Stack, Alert, Chip, Box } from '@mui/joy';
import { Users, Fingerprint } from 'phosphor-react';

import { Page, PageTitle, Modal, Centre, SectionTitle } from '../common/ui/layout';
import { selectFullName, selectUserId } from '../common/slices/account';
import { selectTeam } from '../common/slices/team';
import { useSelector } from '../common/store';

const TeamInsights = function () {
    const fullName = useSelector(selectFullName);
    const userId = useSelector(selectUserId);
    const team = useSelector(selectTeam)!;

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();
    const [leaderboardOpen, setLeaderboardOpen] = React.useState(false);
    const createModalHandler = function (value: boolean) {
        return () => setLeaderboardOpen(value);
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
                        <Button variant="outlined" color="danger" fullWidth>
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

export default TeamInsights;
