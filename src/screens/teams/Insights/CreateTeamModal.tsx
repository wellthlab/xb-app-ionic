import React from 'react';
import { Alert, Stack, TextField } from '@mui/joy';
import * as Yup from 'yup';

import Modal, { IModalProps } from '../../../components/foundation/Modal';
import Textarea from '../../../components/foundation/Textarea';
import useForm from '../../../components/foundation/useForm';

import { createTeam } from '../../../slices/team';
import { useDispatch } from '../../../slices/store';

interface ICreateTeamModal extends Omit<IModalProps, 'headerTitle'> {}

const schema = Yup.object({
    name: Yup.string().required('Team name is missing'),
    desc: Yup.string(),
});

const CreateTeamModal = function ({ onDismiss, ...others }: ICreateTeamModal) {
    const { createHandleSubmit, getInputProps, form } = useForm({ name: '', desc: '' }, schema);

    const dispatch = useDispatch();
    const handleSubmit = createHandleSubmit(async (data) => {
        await dispatch(createTeam(data)).unwrap();
        onDismiss();
    });

    return (
        <Modal headerTitle="Create a team" onAction={handleSubmit} onDismiss={onDismiss} {...others}>
            <Stack spacing={2}>
                <Alert>Once this team is created, you can start inviting people by giving them the invite code.</Alert>
                {form.errors.$root && <Alert color="danger">{form.errors.$root}</Alert>}
                <TextField label="Name" placeholder="The Blueberries" {...getInputProps('name')} />
                <Textarea
                    label="Description"
                    placeholder="Your amazing team description"
                    minRows={3}
                    maxRows={5}
                    {...getInputProps('desc')}
                />
            </Stack>
        </Modal>
    );
};

export default CreateTeamModal;
