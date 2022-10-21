import React from 'react';
import { Card, Button, Typography, Stack, Alert, Chip, Box } from '@mui/joy';
import { Users, Fingerprint } from 'phosphor-react';

import { Page, PageTitle, Modal, Centre, SectionTitle } from '../common/ui/layout';
import { selectFullName, selectUserId } from '../common/slices/account';
import Team, { ITeamMemberProfile } from '../common/models/Team';
import { selectTeam } from '../common/slices/team';
import { useSelector } from '../common/store';
import getErrorMessage from '../common/utils/getErrorMessage';

const TeamInsights = function () {
    const fullName = useSelector(selectFullName);
    const userId = useSelector(selectUserId);
    const team = useSelector(selectTeam)!;

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();
    const [leaderboardOpen, setLeaderboardOpen] = React.useState(false);
    const createModalHandler = function (value: boolean) {
        return () => setLeaderboardOpen(value);
    };

    const [memberProfiles, setMemberProfiles] = React.useState<ITeamMemberProfile[]>([]);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    React.useEffect(() => {
        const getProfiles = async function () {
            try {
                setMemberProfiles(await Team.getMemberProfiles(team.members));
            } catch (error) {
                setErrorMessage(getErrorMessage(error, 'Cannot retrieve members at this timne.'));
            }
        };

        getProfiles();
    }, []);

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

            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}

            <Stack spacing={1}>
                {memberProfiles.map((profile) => (
                    <Card key={profile.id}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>
                                {profile.firstName} {profile.lastName}
                            </Typography>

                            <Stack direction="row" spacing={1}>
                                {profile.id === userId ? (
                                    <Chip color="info" size="sm">
                                        You
                                    </Chip>
                                ) : null}

                                {profile.id === team.members[0] ? (
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
