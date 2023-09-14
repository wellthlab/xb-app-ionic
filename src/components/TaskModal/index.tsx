import React, { useEffect, useState } from 'react';
import { CircularProgress, Stack } from '@mui/joy';
import * as Yup from 'yup';
import Modal, { IModalProps } from '../foundation/Modal';
import useForm from '../foundation/useForm';

import Experiment, { IResponse, ITask } from '../../models/Experiment';
import { useDispatch, useSelector } from '../../slices/store';
import { updateProgress } from '../../slices/account';
import { selectTask } from '../../slices/experiments';
import GetBlock from './GetBlock';

interface ITaskModalProps extends Omit<IModalProps, 'headerTitle'> {
    experimentId: string;
    dayId: number;
    taskId: number;
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

const numberSchema = Yup.number().typeError('This field must be a number');

const getSchema = function (blocks: ITask['blocks']) {
    const keys: Record<string, Yup.AnySchema> = {};

    for (const block of blocks) {
        if (!('rk' in block)) {
            continue;
        }

        if (block.type === 'green-detector') {
            if (!block.optional) {
                keys[block.rk + '-$$g'] = numberSchema.required('This field is missing');
                keys[block.rk + '-$$r'] = numberSchema.required('This field is missing');
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
            subSchema = subSchema.notOneOf([0], 'You need to time this activity!');
        }

        if (block.type === 'checkbox') {
            subSchema = Yup.bool();

            if (!block.optional) {
                subSchema = subSchema.oneOf([true], 'This field must be checked');
            }
        }

        if (!block.optional && block.type !== 'checkbox' && block.type !== 'stopwatch') {
            subSchema = subSchema.required('This field is missing');
        }

        keys[block.rk] = subSchema;
    }

    return Yup.object().shape(keys);
};

const TaskModal = function ({ experimentId, onDismiss, dayId, taskId, ...others }: ITaskModalProps) {
    const task = useSelector((state) => selectTask(state, experimentId, dayId, taskId));

    const schema = React.useMemo(() => getSchema(task.blocks), [task.blocks]);
    const initialValues = React.useMemo(() => getInitialValues(task.blocks), [task.blocks]);

    const { createHandleSubmit, getCheckboxProps, getInputProps } = useForm(initialValues, schema);

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState<IResponse[]>([]);

    const getResponse = async function () {
        const today = new Date();
        let raw = await Experiment.getResponsesForDate(today);
        raw = raw.sort((a, b) => b.createdAt - a.createdAt);
        setResponse(raw);
        setLoading(false);
    };

    useEffect(() => {
        getResponse();
    }, []);

    const handleSubmit = createHandleSubmit(async (data) => {
        if (Object.keys(data).length) {
            await Experiment.saveResponse({ experimentId, taskId, dayId, payload: data });
        }

        await dispatch(updateProgress({ experimentId, dayId, taskId }));

        onDismiss();
    });

    return (
        <Modal headerTitle={task.name} onAction={handleSubmit} onDismiss={onDismiss} {...others}>
            <Stack spacing={2}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    task.blocks.map((block, blockId) => (
                        <GetBlock
                            key={blockId}
                            block={block}
                            blockId={blockId}
                            getCheckboxProps={getCheckboxProps}
                            getInputProps={getInputProps}
                            response={response}
                        />
                    ))
                )}
            </Stack>
        </Modal>
    );
};

export default TaskModal;
