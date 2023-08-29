import { Typography, Select, Slider, sliderClasses, Checkbox, TextField, Link, Stack, Alert } from "@mui/joy";
import React from "react";
import { Block, Compare, IResponse } from "../../models/Experiment";
import MultipleSelect from "../foundation/MultipleSelect";
import CountdownTimer from "./CountdownTimer";
import EmotionPlacer from "./EmotionPlacer";
import GreenDetector from "./GreenDetector";
import HeartRateInput from "./HeartRateInput";
import MovementPicker from "./MovementPicker";
import MovementRecorder from "./MovementRecorder";
import RouteDrawer from "./RouteDrawer";
import StickerPlacer from "./StickerPlacer";
import Stopwatch from "./Stopwatch";
import TimeInput from "./TimeInput";
import YouTubeVideo from "./YoutubeVideo";
import { ArrowSquareOut } from "phosphor-react";
import { GetCheckboxProps, GetInputProps } from "../foundation/useForm";
import { LatLng, LatLngLiteral } from "leaflet";

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

const convertStringToRoute = function (content: string): LatLngLiteral[] {
    const points: LatLngLiteral[] = []
    const split = content.split(",")
    split.pop()
    split.map((line) => {
        const words = line.split(" ")
        points.push(new LatLng(Number(words[0]), Number(words[1])))
    })
    return points
}

function GetBlock(props: BlockProps): JSX.Element {

    if (props.block.type === 'para' || props.block.type === 'title') {
        return (
            <Typography level={props.block.type === 'para' ? 'body1' : 'h6'} key={props.blockId}>
                {renderParagraphWithLinks(props.block.content)}
            </Typography>
        );
    }

    if (props.block.type === 'video') {
        return <YouTubeVideo src={props.block.src} key={props.blockId} />;
    }

    if (props.block.type === 'image') {
        return <img src={props.block.src} alt={props.block.alt} key={props.blockId} />;
    }

    if (props.block.type === 'movement-recorder') {
        return (
            <MovementRecorder
                countdown={props.block.countdown}
                max={props.block.max}
                movements={props.block.movements}
                key={props.blockId}
            />
        );
    }

    if (props.block.type === 'countdown') {
        return (
            <CountdownTimer
                key={props.blockId}
                initialDuration={props.block.duration}
                fixed={props.block.fixed}
                notifications={props.block.notifications}
            />
        );
    }

    if (props.block.type === 'green-detector') {
        return (
            <GreenDetector
                key={props.blockId}
                required={!props.block.optional}
                greenInputProps={props.getInputProps(props.block.rk + '-$$g') as any}
                redInputProps={props.getInputProps(props.block.rk + '-$$r') as any}
            />
        );
    }

    if (props.block.type === 'if-selection') {
        for (const response of props.response) {
            const valueToCompare = response.payload[props.block.value]
            // Checks if the response as the field we are trying to compare
            if (typeof valueToCompare === "undefined") break
            for (var option of props.block.options) {
                switch (props.block.compare) {
                    case Compare.Equal:
                        if (valueToCompare === option.value[0]) {
                            return <Stack spacing={2}>
                                {option.blocks.map((block, blockid) => <GetBlock block={block} blockId={blockid} getInputProps={props.getInputProps} getCheckboxProps={props.getCheckboxProps} response={props.response} />)}
                            </Stack>
                        }
                        break
                    case Compare.Include:
                        for (var word in option.value) {
                            if (valueToCompare.toString().includes(option.value[word])) {
                                return <Stack spacing={2}>
                                    {option.blocks.map((block, blockid) => <GetBlock block={block} blockId={blockid} getInputProps={props.getInputProps} getCheckboxProps={props.getCheckboxProps} response={props.response} />)}
                                </Stack>
                            }
                        }
                }
            }
        }
        return <></>
    }

    const hookProps = props.block.type === 'checkbox' ? props.getCheckboxProps(props.block.rk) : props.getInputProps(props.block.rk);

    const commonProps = {
        label: props.block.label,
        required: !props.block.optional,
        key: props.blockId,
        ...(hookProps as any),
        helperText: hookProps.helperText || props.block.help,
    };

    if (props.block.type === 'select-input') {
        return <Select options={props.block.options} {...commonProps} />;
    }

    if (props.block.type === 'slider-input') {
        const marks = [];

        for (const key of Object.keys(props.block.labels)) {
            marks.push({ value: Number(key), label: props.block.labels[key] });
        }

        return (
            <Slider
                min={props.block.range[0]}
                max={props.block.range[1]}
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

    if (props.block.type === 'heart-rate-input') {
        return <HeartRateInput {...commonProps} />;
    }

    if (props.block.type === 'time-input') {
        return <TimeInput hideSeconds {...commonProps} />;
    }

    if (props.block.type === 'stopwatch') {
        return <Stopwatch {...commonProps} />;
    }

    if (props.block.type === 'checkbox') {
        return <Checkbox {...commonProps} />;
    }

    if (props.block.type === 'movement-picker') {
        return <MovementPicker movements={props.block.movements} {...commonProps} />;
    }

    if (props.block.type === 'route-drawer') {
        return <RouteDrawer {...commonProps} />
    }

    if (props.block.type === 'sticker-placer') {
        for (const response of props.response) {
            const route = response.payload[props.block.value]
                if (typeof route === 'string') {
                    return <StickerPlacer points={convertStringToRoute(route)} option={props.block.option} {...commonProps} />
                }
        }
        return <StickerPlacer points={[]} option={props.block.option} {...commonProps} />
    }

    if (props.block.type === 'multiple-selector') {
        return <MultipleSelect options={props.block.options} {...commonProps} />
    }

    if (props.block.type === 'emotion-placer') {
        for (const response of props.response) {
            const route = response.payload[props.block.value]
                if (typeof route === 'string') {
                    return <EmotionPlacer points={convertStringToRoute(route)} {...commonProps} />
            }
        }
        return <StickerPlacer points={[]} {...commonProps} />
    }

    if (props.block.type === 'text-input') {
        return <TextField {...commonProps} />
    }

    return <TextField {...commonProps} />;
}

type BlockProps = {
    block: Block
    blockId: number
    getCheckboxProps: GetCheckboxProps<Record<string, string | number | boolean>>
    getInputProps: GetInputProps<Record<string, string | number | boolean>>
    response: IResponse[]
}

export default GetBlock

