import Strings from '../utils/string_dict';
import React from 'react';
import { Stack } from '@mui/joy';
import * as Yup from 'yup';

import TaskBlock from './TaskBlock';
import Modal, { IModalProps } from './foundation/Modal';
import useForm from './foundation/useForm';

import Experiment, { ITask } from '../models/Experiment';
import { useDispatch, useSelector } from '../slices/store';
import { reloadResponses, selectSubscriptionByExperimentId, selectSubscriptions } from '../slices/account';
import { selectTask } from '../slices/experiments';

interface ITaskModalProps extends Omit<IModalProps, 'headerTitle'> {
    experimentId: string;
    dayNum: number;
    taskNum: number;
    isSubscribed: boolean;
}

const getInitialValues = function (blocks: ITask['blocks']) {
    const values: Record<string, string | boolean | number> = {};

    for (const block of blocks) {
        if (!('rk' in block)) {
            continue;
        }

        if (block.type === 'checkbox') {
            values[block.rk] = false;
            continue;
        }

        if (block.type === 'green-detector') {
            values[block.rk + '-$$g'] = '';
            values[block.rk + '-$$r'] = '';
            continue;
        }

        if (block.type === 'slider-input' || block.type === 'stopwatch') {
            values[block.rk] = 0;
            continue;
        }

        if (block.type === 'movement-picker') {
            values[block.rk] = '';
            continue;
        }

        values[block.rk] = '';
    }

    return values;
};

const numberSchema = Yup.number().typeError(Strings.this_field_must_be_a_number);

const getSchema = function (blocks: ITask['blocks']) {
    const keys: Record<string, Yup.AnySchema> = {};

    for (const block of blocks) {
        if (!('rk' in block)) {
            continue;
        }

        if (block.type === 'green-detector') {
            if (!block.optional) {
                keys[block.rk + '-$$g'] = numberSchema.required(Strings.this_field_is_missing);
                keys[block.rk + '-$$r'] = numberSchema.required(Strings.this_field_is_missing);
                continue;
            }

            keys[block.rk + '-$$g'] = numberSchema;
            keys[block.rk + '-$$r'] = numberSchema;
            continue;
        }

        let subSchema: Yup.AnySchema = Yup.string();

        if (
            block.type === 'number-input' ||
            block.type === 'heart-rate-input' ||
            block.type === 'slider-input' ||
            block.type === 'stopwatch'
        ) {
            subSchema = numberSchema;
        }

        if (block.type === 'stopwatch' && !block.optional) {
            subSchema = subSchema.notOneOf([0], Strings.you_need_to_time_this);
        }

        if (block.type === 'checkbox') {
            subSchema = Yup.bool();

            if (!block.optional) {
                subSchema = subSchema.oneOf([true], Strings.this_field_must_be_checked);
            }
        }

        if (!block.optional && block.type !== 'checkbox' && block.type !== 'stopwatch') {
            subSchema = subSchema.required(Strings.this_field_is_missing);
        }

        keys[block.rk] = subSchema;
    }

    return Yup.object().shape(keys);
};

const TaskModal = function ({ experimentId, onDismiss, dayNum, taskNum, isSubscribed, ...others }: ITaskModalProps) {
    const task = useSelector((state) => selectTask(state, experimentId, dayNum, taskNum));
    const accountSubscriptions = useSelector(selectSubscriptions);
    const subscription = useSelector((state) => selectSubscriptionByExperimentId(state, experimentId));

    const schema = React.useMemo(() => getSchema(task.blocks), [task.blocks]);
    const initialValues = React.useMemo(() => getInitialValues(task.blocks), [task.blocks]);

    const { createHandleSubmit, getCheckboxProps, getInputProps } = useForm(initialValues, schema);

    const dispatch = useDispatch();

    const handleSubmit = createHandleSubmit(async (data) => {
        await Experiment.saveResponse({ taskId: task.taskId, payload: data, dayNum }, subscription.id);
        await dispatch(reloadResponses(Object.values(accountSubscriptions).map((subscription) => subscription.id)));
        onDismiss();
    });

    return (
        <Modal
            actionButtonDisabled={!isSubscribed}
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
