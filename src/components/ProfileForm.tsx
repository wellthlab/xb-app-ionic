import Strings from '../utils/string_dict';
import React from 'react';

import Form from './foundation/Form';
import { useFormFromBlocks } from './foundation/useForm';

import { selectProfile } from '../slices/account';
import { useSelector } from '../slices/store';
import useStudy from '../hooks/useStudy';
import TaskBlock from './TaskModal/TaskBlock';

export interface IProfileFormProps {
    onSubmit: (data: Record<string, string | boolean | number>) => void;
}

const ProfileForm = function ({ onSubmit }: IProfileFormProps) {
    const { isPending } = useStudy();

    if (isPending) {
        return <div>Loading...</div>;
    }

    return <InnerForm onSubmit={onSubmit} />;
};

const InnerForm = function ({ onSubmit }: IProfileFormProps) {
    const { study } = useStudy();
    const profile = useSelector(selectProfile);

    const { getInputProps, getCheckboxProps, createHandleSubmit, form } = useFormFromBlocks(study!.profile, profile);

    return (
        <React.Fragment>
            <Form submitLabel={Strings.lets_roll} message={form.errors.$root} onSubmit={createHandleSubmit(onSubmit)}>
                {study!.profile.map((block, blockId) => (
                    <TaskBlock block={block} key={blockId} inputs={{ getInputProps, getCheckboxProps }} />
                ))}
            </Form>
        </React.Fragment>
    );
};

export default ProfileForm;
