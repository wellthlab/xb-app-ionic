import Strings from '../../../utils/string_dict';
import React from 'react';
import { Stack } from '@mui/joy';

import TaskBlock from '../../../components/TaskModal/TaskBlock';
import Modal, { IModalProps } from '../../../components/foundation/Modal';
import { useFormFromBlocks } from '../../../components/foundation/useForm';

import { IExperiment } from '../../../models/Experiment';

interface ITaskModalProps extends Omit<IModalProps, 'headerTitle'> {
    experiment: IExperiment;
    dayNum: number;
    taskNum: number;
    isSubscribed: boolean;
}

const TaskModal = function ({ experiment, onDismiss, dayNum, taskNum, isSubscribed, ...others }: ITaskModalProps) {
    const task = experiment.days[dayNum].tasks[taskNum];
    const userInCohort = false;
    const { createHandleSubmit, getCheckboxProps, getInputProps } = useFormFromBlocks(task.blocks);
    const handleSubmit = createHandleSubmit(async (data) => {
        onDismiss();
    });

    console.log(task.blocks);

    return (
        <Modal
            actionButtonLabel={Strings.submit}
            actionButtonDisabledToolTipTitle={
                userInCohort ? Strings.not_subscribed_to_experiment : Strings.subscribe_to_complete_tasks
            }
            headerTitle={Strings.preview + task.name}
            onAction={handleSubmit}
            onDismiss={onDismiss}
            {...others}
        >
            <Stack spacing={2}>
                {task.blocks.map((block, blockId) => (
                    <TaskBlock
                        type={task.type}
                        key={blockId}
                        block={block}
                        inputs={{ getCheckboxProps, getInputProps }}
                    />
                ))}
            </Stack>
        </Modal>
    );
};

export default TaskModal;
