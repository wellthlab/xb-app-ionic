import React from 'react';
import { Alert, Stack, TextField } from '@mui/joy';
import * as Yup from 'yup';

import { Modal, IModalProps } from '../../common/ui/layout';
import { Textarea, useForm } from '../../foundation/form';
import { createTeam } from '../../slices/team';
import { useDispatch } from '../../slices/store';

interface ICreateTeamModal extends Omit<IModalProps, 'headerTitle'> {}

const schema = Yup.object({
    name: Yup.string().required('Team name is missing'),
    desc: Yup.string(),
});

const CreateTeamModal = function (props: ICreateTeamModal) {
    const { createHandleSubmit, getInputProps } = useForm({ name: '', desc: '' }, schema);

    const dispatch = useDispatch();
    const handleSubmit = createHandleSubmit((data) => {
        return dispatch(createTeam(data)).unwrap();
    });

    return (
        <Modal
            headerTitle="Create a team"
            initialBreakpoint={0.75}
            breakpoints={[0, 0.75]}
            onAction={handleSubmit}
            {...props}
        >
            <Alert sx={{ mb: 3 }}>
                Once this team is created, you can start inviting people by giving them the invite code.
            </Alert>
            <Stack spacing={2}>
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
