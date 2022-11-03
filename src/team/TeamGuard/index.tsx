import React from 'react';
import { Typography, Button, Stack } from '@mui/joy';

import JoinTeamModal from './JoinTeamModal';
import CreateTeamModal from './CreateTeamModal';
import { Centre, Page } from '../../common/ui/layout';
import { selectTeam } from '../../common/slices/team';
import { useSelector } from '../../common/store';

interface ITeamGuardProps {
    children: React.ReactNode;
}

const TeamGuard = function ({ children }: ITeamGuardProps) {
    const team = useSelector(selectTeam);

    const [joinModalOpen, setJoinModalOpen] = React.useState(false);
    const [createModalOpen, setCreateModalOpen] = React.useState(false);

    const createModalHandler = function (setter: (value: any) => void, value: boolean) {
        return () => {
            setter(value);
        };
    };

    return (
        <React.Fragment>
            {team ? (
                children
            ) : (
                <Page>
                    <Centre>
                        <Stack spacing={2}>
                            <Typography level="h6" component="p">
                                You are currently not in a team
                            </Typography>
                            <Button onClick={createModalHandler(setJoinModalOpen, true)}>Join</Button>
                            <Typography level="body2" textAlign="center">
                                Or
                            </Typography>
                            <Button variant="outlined" onClick={createModalHandler(setCreateModalOpen, true)}>
                                Create one
                            </Button>
                        </Stack>
                    </Centre>
                </Page>
            )}

            <CreateTeamModal isOpen={createModalOpen} onDismiss={createModalHandler(setCreateModalOpen, false)} />
            <JoinTeamModal isOpen={joinModalOpen} onDismiss={createModalHandler(setJoinModalOpen, false)} />
        </React.Fragment>
    );
};

export default TeamGuard;
