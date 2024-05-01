import Strings from '../../../utils/string_dict.js';
import React from 'react';
import { Typography, Button, Stack } from '@mui/joy';

import JoinTeamModal from './JoinTeamModal';
import CreateTeamModal from './CreateTeamModal';
import InnerTeamInsights from './InnerTeamInsights';

import Page from '../../../components/foundation/Page';
import Centre from '../../../components/foundation/Centre';

import { selectTeam } from '../../../slices/team';
import { useSelector } from '../../../slices/store';

const Insights = function () {
    const team = useSelector(selectTeam);

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();

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
                <InnerTeamInsights />
            ) : (
                <Page ref={setPresentingElement}>
                    <Centre>
                        <Stack spacing={2}>
                            <Typography level="h6" component="p">
                                {Strings.you_are_currently_not_in_a}
                            </Typography>
                            <Button onClick={createModalHandler(setJoinModalOpen, true)}>{Strings.join}</Button>
                            <Typography level="body2" textAlign="center">
                                {Strings.or}
                            </Typography>
                            <Button variant="outlined" onClick={createModalHandler(setCreateModalOpen, true)}>
                                {Strings.create_one}
                            </Button>
                        </Stack>
                    </Centre>
                </Page>
            )}

            <CreateTeamModal
                isOpen={createModalOpen}
                onDismiss={createModalHandler(setCreateModalOpen, false)}
                presentingElement={presentingElement}
            />
            <JoinTeamModal
                isOpen={joinModalOpen}
                onDismiss={createModalHandler(setJoinModalOpen, false)}
                presentingElement={presentingElement}
            />
        </React.Fragment>
    );
};

export default Insights;
