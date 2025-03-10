import Strings from '../../../utils/string_dict';
import React from 'react';
import { Stack } from '@mui/joy';

import TaskBlock from "../../../components/TaskModal/TaskBlock";
import Modal, { IModalProps } from '../../../components/foundation/Modal';
import { useFormFromBlocks } from '../../../components/foundation/useForm';

import Experiment, {IExperiment, ISelectSubscription} from '../../../models/Experiment';
import { useDispatch, useSelector } from '../../../slices/store';
import {
    selectSubscriptionByExperimentId,
    selectSubscriptions,
    isUserInCohort,
    subscribeToExperiments, reloadResponses,
} from '../../../slices/account';
import { selectAllExperiments, selectCurrentDay, selectTask } from '../../../slices/experiments';

interface ITaskModalProps extends Omit<IModalProps, 'headerTitle'> {
    experiment: IExperiment;
    dayNum: number;
    taskNum: number;
    isSubscribed: boolean;
}

const TaskModal = function ({ experiment, onDismiss, dayNum, taskNum, isSubscribed, ...others }: ITaskModalProps) {
    const task = experiment.days[dayNum].tasks[taskNum];
    const currentDay =0;
    const actionDisabled = true;
    const userInCohort =false;
    const { createHandleSubmit, getCheckboxProps, getInputProps } = useFormFromBlocks(task.blocks);
    const handleSubmit = createHandleSubmit(async (data) => {
        onDismiss();
    });


    return (
        <Modal
            actionButtonDisabled={actionDisabled}
            actionButtonLabel={Strings.submit}
            actionButtonDisabledToolTipTitle={userInCohort ? Strings.not_subscribed_to_experiment : Strings.subscribe_to_complete_tasks}
            headerTitle= { actionDisabled ? Strings.preview + task.name : task.name +  ' - ' + Strings.day + ' ' +  `${currentDay +1}` + ' ' + Strings.of + ' 5'}
            onAction={handleSubmit}
            onDismiss={onDismiss}
            {...others}
        >
            <Stack style={{ pointerEvents: actionDisabled ? 'none' : undefined }} spacing={2}>
                {task.blocks.map((block, blockId) => (
                    <TaskBlock type={task.type} key={blockId} block={block} inputs={{ getCheckboxProps, getInputProps }} />
                ))}
            </Stack>
        </Modal>
    );
};

export default TaskModal;
