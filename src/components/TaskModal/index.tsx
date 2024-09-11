import Strings from '../../utils/string_dict';
import React from 'react';
import { Stack } from '@mui/joy';

import TaskBlock from './TaskBlock';
import Modal, { IModalProps } from '../foundation/Modal';
import { useFormFromBlocks } from '../foundation/useForm';

import Experiment, { ISelectSubscription } from '../../models/Experiment';
import { useDispatch, useSelector } from '../../slices/store';
import {
    selectSubscriptionByExperimentId,
    selectSubscriptions,
    isUserInCohort,
    subscribeToExperiments, reloadResponses,
} from '../../slices/account';
import { selectAllExperiments, selectCurrentDay, selectTask } from '../../slices/experiments';

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
    const allExperiments = useSelector(selectAllExperiments);

    const userInCohort = useSelector((state) => isUserInCohort(state));

    const { createHandleSubmit, getCheckboxProps, getInputProps } = useFormFromBlocks(task.blocks);

    const dispatch = useDispatch();

    const handleSubmit = createHandleSubmit(async (data) => {
        await handleSelectSubscriptionTask(data)
        await Experiment.saveResponse({ taskId: task.taskId, payload: data, dayNum }, subscription.id);
        await dispatch(reloadResponses(Object.values(accountSubscriptions).map((subscription) => subscription.id)));
        onDismiss();
    });

    const handleSelectSubscriptionTask = async (data: any) => {
        const selectedExperimentIds = task.blocks
            .filter(block => block.type === 'select-subscription')
            .flatMap(block => (block as ISelectSubscription).options)
            .filter(option => Object.values(data).includes(option.label))
            .map(option => option.experimentId);

        if (selectedExperimentIds.length > 0) {
            const experimentsForSubscription = Object.values(allExperiments).filter(experiment => selectedExperimentIds.includes(experiment.id));
            if (experimentsForSubscription.length > 0) {
                await dispatch(
                    subscribeToExperiments({
                        experiments: experimentsForSubscription,
                        subscriptionStartTime: Date.now(),
                    }),
                );
            }
        }
    }

    return (
        <Modal
            actionButtonDisabled={actionButtonDisabled}
            actionButtonLabel={Strings.submit}
            actionButtonDisabledToolTipTitle={userInCohort ? Strings.not_subscribed_to_experiment : Strings.subscribe_to_complete_tasks}
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
