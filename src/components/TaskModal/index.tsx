import Strings from '../../utils/string_dict';
import React from 'react';
import { Stack } from '@mui/joy';

import TaskBlock from './TaskBlock';
import Modal, { IModalProps } from '../foundation/Modal';
import { useFormFromBlocks } from '../foundation/useForm';

import { useDispatch, useSelector } from '../../slices/store';
import { saveResponse, selectTask } from '../../slices/experiments';

interface ITaskModalProps extends Omit<IModalProps, 'headerTitle'> {
    experimentId: string;
    dayNum: number;
    taskNum: number;
}

const TaskModal = function ({ experimentId, onDismiss, dayNum, taskNum, ...others }: ITaskModalProps) {
    const task = useSelector((state) => selectTask(state, experimentId, dayNum, taskNum));

    const { createHandleSubmit, getCheckboxProps, getInputProps } = useFormFromBlocks(task.blocks);

    const dispatch = useDispatch();

    const handleSubmit = createHandleSubmit(async (data) => {
        await dispatch(saveResponse({ experimentId, taskId: task.taskId, payload: data, dayNum }));
        onDismiss();
    });

    return (
        <Modal
            actionButtonLabel={Strings.submit}
            headerTitle={task.name + ' - ' + Strings.day + ' ' + `${dayNum + 1}` + ' ' + Strings.of + ' 5'}
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
