import Strings from '../../../utils/string_dict';
import React from 'react';
import { Alert, TextField, Stack, Typography } from '@mui/joy';
import * as Yup from 'yup';

import Modal, { IModalProps } from '../../../components/foundation/Modal';
import useForm from '../../../components/foundation/useForm';

import { joinTeam } from '../../../slices/team';
import { useDispatch } from '../../../slices/store';

const schema = Yup.object().shape({
    invite: Yup.string().required(Strings.invite_code_is_missing).length(6, Strings.invite_code_must_have_6),
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
        <Modal headerTitle={Strings.join_a_team} onAction={handleSubmit} onDismiss={onDismiss} {...others}>
            <Stack spacing={2}>
                <Typography level="body2">{Strings.an_invite_code_is_a_unique}</Typography>
                {form.errors.$root && <Alert color="danger">{form.errors.$root}</Alert>}
                <TextField label={Strings.invite_code} placeholder="AB1234" {...getInputProps('invite')} />
            </Stack>
        </Modal>
    );
};

export default JoinTeamModal;
