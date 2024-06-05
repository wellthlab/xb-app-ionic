import Strings from '../../../utils/string_dict';
import React from 'react';
import { Alert, Stack, TextField, Typography } from '@mui/joy';
import * as Yup from 'yup';

import Modal, { IModalProps } from '../../../components/foundation/Modal';
import Textarea from '../../../components/foundation/Textarea';
import useForm from '../../../components/foundation/useForm';

import { createTeam } from '../../../slices/team';
import { useDispatch } from '../../../slices/store';

interface ICreateTeamModal extends Omit<IModalProps, 'headerTitle'> {}

const schema = Yup.object({
    name: Yup.string().required(Strings.team_name_is_missing),
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
        <Modal headerTitle={Strings.create_a_team} onAction={handleSubmit} onDismiss={onDismiss} {...others}>
            <Stack spacing={2}>
                <Typography level="body2">{Strings.once_this_team_is_created_you}</Typography>
                {form.errors.$root && <Alert color="danger">{form.errors.$root}</Alert>}
                <TextField label={Strings.name} placeholder={Strings.the_blueberries} {...getInputProps('name')} />
                <Textarea
                    label={Strings.description}
                    placeholder={Strings.your_amazing_team_description}
                    minRows={3}
                    maxRows={5}
                    {...getInputProps('desc')}
                />
            </Stack>
        </Modal>
    );
};

export default CreateTeamModal;
