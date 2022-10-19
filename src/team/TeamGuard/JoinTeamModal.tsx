import React from 'react';
import { Alert, TextField } from '@mui/joy';
import * as Yup from 'yup';

import { Modal, IModalProps } from '../../common/ui/layout';
import { useForm } from '../../common/ui/form';
import { joinTeam } from '../../common/slices/team';
import { useDispatch } from '../../common/store';

const schema = Yup.object().shape({
    invite: Yup.string().required('Invite code is missing').length(6, 'Invite code must have 6 digits'),
});

interface IJoinTeamModal extends Omit<IModalProps, 'headerTitle'> {}

const JoinTeamModal = function (props: IJoinTeamModal) {
    const { getInputProps, createHandleSubmit } = useForm({ invite: '' }, schema);

    const dispatch = useDispatch();
    const handleSubmit = createHandleSubmit((data) => {
        return dispatch(joinTeam(data.invite)).unwrap();
    });

    return (
        <Modal headerTitle="Join a team" onAction={handleSubmit} {...props}>
            <Alert sx={{ mb: 3 }}>
                An invite code is a unique 6-digit code assigned to each team. Ask the owner, or any member of the team
                you want to join to continue.
            </Alert>
            <TextField label="Invite code" placeholder="AB123456" {...getInputProps('invite')} />
        </Modal>
    );
};

export default JoinTeamModal;
