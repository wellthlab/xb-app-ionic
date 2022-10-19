import React from 'react';
import { Alert, TextField } from '@mui/joy';
import * as Yup from 'yup';

import { Modal, IModalProps } from '../../common/ui/layout';
import { useForm } from '../../common/ui/form';
import { createTeam } from '../../common/slices/team';
import { useDispatch } from '../../common/store';

interface ICreateTeamModal extends Omit<IModalProps, 'headerTitle'> {}

const schema = Yup.object({
    name: Yup.string().required('Team name is missing'),
});

const CreateTeamModal = function (props: ICreateTeamModal) {
    const { createHandleSubmit, getInputProps } = useForm({ name: '' }, schema);

    const dispatch = useDispatch();
    const handleSubmit = createHandleSubmit((data) => {
        return dispatch(createTeam(data.name)).unwrap();
    });

    return (
        <Modal headerTitle="Create a team" onAction={handleSubmit} {...props}>
            <Alert sx={{ mb: 3 }}>
                Once this team is created, you can start inviting people by giving them the invite code.
            </Alert>
            <TextField label="Name" placeholder="The Blueberries" {...getInputProps('name')} />
        </Modal>
    );
};

export default CreateTeamModal;
