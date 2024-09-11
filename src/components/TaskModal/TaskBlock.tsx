import React from 'react';
import { Typography, TextField, Link, sliderClasses, Divider, Stack } from '@mui/joy';
import { ArrowSquareOut } from 'phosphor-react';

import YouTubeVideo from './YoutubeVideo';
import GreenDetector from './GreenDetector';
import HeartRateInput from './HeartRateInput';
import CountdownTimer from './CountdownTimer';
import TimeInput from './TimeInput';
import MovementRecorder from './MovementRecorder';
import MovementPicker from './MovementPicker';
import Stopwatch from './Stopwatch';

import Select from '../foundation/Select';
import Checkbox from '../foundation/Checkbox';
import Slider from '../foundation/Slider';

import { Block } from '../../models/Experiment';
import Accordion from '@mui/material/Accordion';
import AddIcon from '@mui/icons-material/Add';

import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

export interface ITaskBlockProps {
    block: Block;
    inputs?: {
        getInputProps: (key: string) => any;
        getCheckboxProps: (key: string) => any;
    };
}

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

const TaskBlock = function ({ block, inputs }: ITaskBlockProps) {
    // Non-input blocks

    if (block.type === 'para' || block.type === 'title') {
        return (
            <Typography level={block.type === 'para' ? 'body1' : 'h6'}>
                {renderParagraphWithLinks(block.content)}
            </Typography>
        );
    }

    if (block.type === 'video') {
        return <YouTubeVideo src={block.src} />;
    }

    if (block.type === 'image') {
        return <img src={block.src} alt={block.alt} />;
    }

    if (block.type === 'movement-recorder') {
        return <MovementRecorder countdown={block.countdown} max={block.max} movements={block.movements} />;
    }

    if (block.type === 'countdown') {
        return (
            <CountdownTimer initialDuration={block.duration} fixed={block.fixed} notifications={block.notifications} />
        );
    }

    if ((block as any)['type'] === 'expandable') {
        return <Accordion>
            <AccordionSummary expandIcon={<AddIcon />}>
                <Typography
                    sx={{ mb: 2, mt: 2, fontWeight: 'lg' }}>
                    {(block as any)['title']}
                </Typography>
            </AccordionSummary>

            <Divider />

            <AccordionDetails style={{ backgroundColor: '#eeeeee' }}>
                <br />
                <Stack spacing={2}>
                    {(block as any)['contents'].map((element: any) => (
                        <TaskBlock block={element}></TaskBlock>
                    ))}
                </Stack>
            </AccordionDetails>
        </Accordion>;
    }

    // Input blocks

    if (!inputs) {
        throw new Error(
            'inputs prop must be provided to <TaskBlock /> if you are expecting some blocks to be input widgets',
        );
    }

    if (!block.rk) {
        throw new Error('All input block must have the key "rk". Please ensure that the database entry is correct. (Block ' + (block as any).blockId + ' )');
    }

    if (block.type === 'green-detector') {
        return (
            <GreenDetector
                required={!block.optional}
                greenInputProps={inputs.getInputProps(block.rk + '-$$g') as any}
                redInputProps={inputs.getInputProps(block.rk + '-$$r') as any}
            />
        );
    }

    const hookProps = block.type === 'checkbox' ? inputs.getCheckboxProps(block.rk) : inputs.getInputProps(block.rk);

    const commonProps = {
        label: block.label,
        required: !block.optional,
        ...(hookProps as any),
        helperText: hookProps.helperText || block.help,
    };

    if (block.type === 'select-input') {
        return <Select options={block.options} {...commonProps} />;
    }

    if (block.type === 'select-subscription') {
        return <Select options={block.options.map(option => option.label)} {...commonProps} />;
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

    return <TextField {...commonProps} />;
};

export default TaskBlock;
