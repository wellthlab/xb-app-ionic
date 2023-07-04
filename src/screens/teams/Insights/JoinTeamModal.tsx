import React from 'react';
import { Alert, TextField, Stack, Typography } from '@mui/joy';
import * as Yup from 'yup';

import Modal, { IModalProps } from '../../../components/foundation/Modal';
import useForm from '../../../components/foundation/useForm';

import { joinTeam } from '../../../slices/team';
import { useDispatch } from '../../../slices/store';

const schema = Yup.object().shape({
    invite: Yup.string().required('Invite code is missing').length(6, 'Invite code must have 6 digits'),
});

interface IJoinTeamModal extends Omit<IModalProps, 'headerTitle'> {}

const JoinTeamModal = function ({ onDismiss, ...others }: IJoinTeamModal) {
    const { getInputProps, createHandleSubmit, form } = useForm({ invite: '' }, schema);

    const dispatch = useDispatch();
    const handleSubmit = createHandleSubmit(async (data) => {
        await dispatch(joinTeam(data.invite)).unwrap();
        onDismiss();
    });

    return (
        <Modal headerTitle="Join a team" onAction={handleSubmit} onDismiss={onDismiss} {...others}>
            <Stack spacing={2}>
                <Typography level="body2">
                    An invite code is a unique 6-digit code assigned to each team. Ask the owner, or any member of the
                    team you want to join to continue.
                </Typography>
                {form.errors.$root && <Alert color="danger">{form.errors.$root}</Alert>}
                <TextField label="Invite code" placeholder="AB1234" {...getInputProps('invite')} />
            </Stack>
        </Modal>
    );
};

export default JoinTeamModal;
