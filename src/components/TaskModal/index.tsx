import Strings from '../../utils/string_dict';
import React from 'react';
import { Stack } from '@mui/joy';

import TaskBlock from './TaskBlock';
import Modal, { IModalProps } from '../foundation/Modal';
import { useFormFromBlocks } from '../foundation/useForm';

import Experiment from '../../models/Experiment';
import { useDispatch, useSelector } from '../../slices/store';
import { reloadResponses, selectSubscriptionByExperimentId, selectSubscriptions } from '../../slices/account';
import { selectCurrentDay, selectTask } from '../../slices/experiments';

interface ITaskModalProps extends Omit<IModalProps, 'headerTitle'> {
    experimentId: string;
    dayNum: number;
    taskNum: number;
    isSubscribed: boolean;
}

const TaskModal = function ({ experimentId, onDismiss, dayNum, taskNum, isSubscribed, ...others }: ITaskModalProps) {
    const task = useSelector((state) => selectTask(state, experimentId, dayNum, taskNum));
    const accountSubscriptions = useSelector(selectSubscriptions);
    const subscription = useSelector((state) => selectSubscriptionByExperimentId(state, experimentId));
    const currentDay = useSelector((state) => selectCurrentDay(state, experimentId));
    const actionButtonDisabled = !isSubscribed || currentDay < dayNum;

    const { createHandleSubmit, getCheckboxProps, getInputProps } = useFormFromBlocks(task.blocks);

    const dispatch = useDispatch();

    const handleSubmit = createHandleSubmit(async (data) => {
        await Experiment.saveResponse({ taskId: task.taskId, payload: data, dayNum }, subscription.id);
        await dispatch(reloadResponses(Object.values(accountSubscriptions).map((subscription) => subscription.id)));
        onDismiss();
    });

    return (
        <Modal
            actionButtonDisabled={actionButtonDisabled}
            actionButtonLabel={Strings.submit}
            actionButtonDisabledToolTipTitle={Strings.subscribe_to_complete_tasks}
            headerTitle={task.name}
            onAction={handleSubmit}
            onDismiss={onDismiss}
            {...others}
        >
            <Stack spacing={2}>
                {task.blocks.map((block, blockId) => (
                    <TaskBlock key={blockId} block={block} inputs={{ getCheckboxProps, getInputProps }} />
                ))}
            </Stack>
        </Modal>
    );
};

export default TaskModal;
