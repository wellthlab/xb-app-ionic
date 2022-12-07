import React from 'react';
import { Alert, TextField } from '@mui/joy';
import * as Yup from 'yup';

import Modal, { IModalProps } from '../../shared/foundation/Modal';
import useForm from '../../shared/foundation/useForm';

import { joinTeam } from '../../shared/slices/team';
import { useDispatch } from '../../shared/slices/store';

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
        <Modal
            headerTitle="Join a team"
            initialBreakpoint={0.5}
            breakpoints={[0, 0.5, 0.75]}
            onAction={handleSubmit}
            {...props}
        >
            <Alert sx={{ mb: 3 }}>
                An invite code is a unique 6-digit code assigned to each team. Ask the owner, or any member of the team
                you want to join to continue.
            </Alert>
            <TextField label="Invite code" placeholder="AB1234" {...getInputProps('invite')} />
        </Modal>
    );
};

export default JoinTeamModal;
