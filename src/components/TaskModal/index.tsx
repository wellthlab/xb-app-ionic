
import React from 'react';
import { Typography, TextField, Stack, Link, sliderClasses } from '@mui/joy';
import * as Yup from 'yup';
import { ArrowSquareOut } from 'phosphor-react';

import YouTubeVideo from './YoutubeVideo';
import GreenDetector from './GreenDetector';
import HeartRateInput from './HeartRateInput';
import CountdownTimer from './CountdownTimer';
import TimeInput from './TimeInput';
import MovementRecorder from './MovementRecorder';
import MovementPicker from './MovementPicker';
import Stopwatch from './Stopwatch';

import Modal, { IModalProps } from '../foundation/Modal';
import Select from '../foundation/Select';
import Checkbox from '../foundation/Checkbox';
import Slider from '../foundation/Slider';
import useForm from '../foundation/useForm';

import Experiment, { ITask } from '../../models/Experiment';
import { useDispatch, useSelector } from '../../slices/store';
import { updateProgress } from '../../slices/account';
import { selectTask } from '../../slices/experiments';
import RouteDrawer from './RouteDrawer';
import StickerPlacer from './StickerPlacer';
import MultipleSelect from '../foundation/MultipleSelect';

interface ITaskModalProps extends Omit<IModalProps, 'headerTitle'> {
    experimentId: string;
    dayId: number;
    taskId: number;
}

const getInitialValues = function (blocks: ITask['blocks']) {
    const values: Record<string, string | boolean | number | string[]> = {};

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

        if (block.type === 'multiple-selector' || block.type === 'sticker-placer') {
            values[block.rk] = []
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
        
        if (block.type==='multiple-selector') {
            subSchema = Yup.mixed();
        }

        keys[block.rk] = subSchema;
    }

    return Yup.object().shape(keys);
};

const renderParagraphWithLinks = function (content: string) {
    // This is a paragrah with [link](https://google.com)
    const parts = content.split(/(\[[^\]]+\]\([^\)]+\))/);

    return parts.map((part) => {
        if (part[0] === '[') {
            const [, mask, , link] = part.split(/[\[\]\(\)]/);
            return (
                <Link href={link} target="_blank" rel="noopener" endDecorator={<ArrowSquareOut />}>
                    {mask}
                </Link>
            );
        }

        return part;
    });
};

const TaskModal = function ({ experimentId, onDismiss, dayId, taskId, ...others }: ITaskModalProps) {
    const task = useSelector((state) => selectTask(state, experimentId, dayId, taskId));

    const schema = React.useMemo(() => getSchema(task.blocks), [task.blocks]);
    const initialValues = React.useMemo(() => getInitialValues(task.blocks), [task.blocks]);

    const { createHandleSubmit, getCheckboxProps, getInputProps } = useForm(initialValues, schema);

    const dispatch = useDispatch();

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
                {task.blocks.map((block, blockId) => {
                    if (block.type === 'para' || block.type === 'title') {
                        return (
                            <Typography level={block.type === 'para' ? 'body1' : 'h6'} key={blockId}>
                                {renderParagraphWithLinks(block.content)}
                            </Typography>
                        );
                    }

                    if (block.type === 'video') {
                        return <YouTubeVideo src={block.src} key={blockId} />;
                    }

                    if (block.type === 'image') {
                        return <img src={block.src} alt={block.alt} key={blockId} />;
                    }

                    if (block.type === 'movement-recorder') {
                        return (
                            <MovementRecorder
                                countdown={block.countdown}
                                max={block.max}
                                movements={block.movements}
                                key={blockId}
                            />
                        );
                    }

                    if (block.type === 'countdown') {
                        return (
                            <CountdownTimer
                                key={blockId}
                                initialDuration={block.duration}
                                fixed={block.fixed}
                                notifications={block.notifications}
                            />
                        );
                    }

                    if (block.type === 'green-detector') {
                        return (
                            <GreenDetector
                                key={blockId}
                                required={!block.optional}
                                greenInputProps={getInputProps(block.rk + '-$$g') as any}
                                redInputProps={getInputProps(block.rk + '-$$r') as any}
                            />
                        );
                    }

                    const hookProps = block.type === 'checkbox' ? getCheckboxProps(block.rk) : getInputProps(block.rk);

                    const commonProps = {
                        label: block.label,
                        required: !block.optional,
                        key: blockId,
                        ...(hookProps as any),
                        helperText: hookProps.helperText || block.help,
                    };

                    if (block.type === 'select-input') {
                        return <Select options={block.options} {...commonProps} />;
                    }

                    if (block.type === 'slider-input') {
                        const marks = [];

                        for (const key of Object.keys(block.labels)) {
                            marks.push({ value: Number(key), label: block.labels[key] });
                        }

                        return (
                            <Slider
                                min={block.range[0]}
                                max={block.range[1]}
                                size="sm"
                                marks={marks}
                                {...commonProps}
                                sx={{
                                    // Need both of the selectors to make it works on the server-side and client-side
                                    [`& [style*="left:0%"], & [style*="left: 0%"]`]: {
                                        [`&.${sliderClasses.markLabel}`]: {
                                            transform: 'none',
                                        },
                                        [`& .${sliderClasses.valueLabel}`]: {
                                            left: 'calc(var(--Slider-thumbSize) / 2)',
                                            borderBottomLeftRadius: 0,
                                            '&::before': {
                                                left: 0,
                                                transform: 'translateY(100%)',
                                                borderLeftColor: 'currentColor',
                                            },
                                        },
                                    },
                                    [`& [style*="left:100%"], & [style*="left: 100%"]`]: {
                                        [`&.${sliderClasses.markLabel}`]: {
                                            transform: 'translateX(-100%)',
                                        },
                                        [`& .${sliderClasses.valueLabel}`]: {
                                            right: 'calc(var(--Slider-thumbSize) / 2)',
                                            borderBottomRightRadius: 0,
                                            '&::before': {
                                                left: 'initial',
                                                right: 0,
                                                transform: 'translateY(100%)',
                                                borderRightColor: 'currentColor',
                                            },
                                        },
                                    },
                                }}
                            />
                        );
                    }

                    if (block.type === 'heart-rate-input') {
                        return <HeartRateInput {...commonProps} />;
                    }

                    if (block.type === 'time-input') {
                        return <TimeInput hideSeconds {...commonProps} />;
                    }

                    if (block.type === 'stopwatch') {
                        return <Stopwatch {...commonProps} />;
                    }

                    if (block.type === 'checkbox') {
                        return <Checkbox {...commonProps} />;
                    }

                    if (block.type === 'movement-picker') {
                        return <MovementPicker movements={block.movements} {...commonProps} />;
                    }

                    if (block.type === 'route-drawer') {
                        return <RouteDrawer {...commonProps}/>
                    }

                    if (block.type === 'sticker-placer') {
                        return <StickerPlacer {...commonProps} />
                    }

                    if (block.type === 'multiple-selector') {
                        return <MultipleSelect options={block.options} {...commonProps}/>
                    }

                    return <TextField {...commonProps} />;
                })}
            </Stack>
        </Modal>
    );
};

export default TaskModal;
