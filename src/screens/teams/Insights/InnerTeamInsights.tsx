import Strings from '../../../utils/string_dict';
import React from 'react';
import { useIonAlert } from '@ionic/react';
import { Card, Button, Typography, Stack, Chip, Box } from '@mui/joy';
import { Users, Fingerprint } from 'phosphor-react';

import Page from '../../../components/foundation/Page';
import PageTitle from '../../../components/foundation/PageTitle';
import Modal from '../../../components/foundation/Modal';
import Centre from '../../../components/foundation/Centre';
import SectionTitle from '../../../components/foundation/SectionTitle';

import { selectUserId } from '../../../slices/account';
import { leaveTeam, selectTeam } from '../../../slices/team';
import { useSelector, useDispatch } from '../../../slices/store';

const InnerTeamInsights = function () {
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
            header: Strings.are_you_sure,
            subHeader: Strings.you_will_be_able_to_join_this,
            buttons: [
                {
                    text: Strings.cancel,
                    role: 'cancel',
                },
                {
                    text: Strings.ok,
                    role: 'confirm',
                    handler: () => dispatch(leaveTeam()),
                },
            ],
        });
    };

    return (
        <Page ref={setPresentingElement}>
            <PageTitle>{Strings.teams}</PageTitle>
            <Card sx={{ mb: 4 }}>
                <Typography level="h5" sx={{ mb: 1 }}>
                    {team.name}
                </Typography>
                <Typography level="body2" sx={{ mb: 3 }}>
                    {team.desc || Strings.no_description}
                </Typography>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                        <Users />
                        <Typography>
                            {team.members.length}
                            {Strings.members}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        <Fingerprint />
                        <Typography>{team.invite}</Typography>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                        <Button fullWidth onClick={createModalHandler(true)}>
                            {Strings.leaderboard}
                        </Button>
                        <Button variant="outlined" color="danger" onClick={handleLeaveTeam} fullWidth>
                            {Strings.leave_team}
                        </Button>
                    </Stack>
                </Stack>
            </Card>

            <SectionTitle>{Strings.members}</SectionTitle>

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
                                        {Strings.you}
                                    </Chip>
                                ) : null}

                                {id === team.members[0].id ? (
                                    <Chip color="success" size="sm">
                                        {Strings.owner}
                                    </Chip>
                                ) : null}
                            </Stack>
                        </Box>
                        <Typography level="body3">{profile.department}</Typography>
                    </Card>
                ))}
            </Stack>

            <Modal
                headerTitle={Strings.teams_leaderboard}
                isOpen={leaderboardOpen}
                presentingElement={presentingElement}
                onDismiss={createModalHandler(false)}
            >
                <Centre>
                    <Typography>{Strings.this_feature_is_coming_soon}</Typography>
                    <Typography>{Strings.stay_tuned}</Typography>
                </Centre>
            </Modal>
        </Page>
    );
};

export default InnerTeamInsights;
