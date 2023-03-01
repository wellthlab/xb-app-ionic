import React from 'react';
import { useParams } from 'react-router-dom';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineDot,
    TimelineConnector,
    TimelineContent,
    timelineItemClasses,
} from '@mui/lab';
import { CaretRight } from 'phosphor-react';

import Page from '../../../components/foundation/Page';
import List from '../../../components/foundation/List';
import ListItem from '../../../components/foundation/ListItem';
import SectionTitle from '../../../components/foundation/SectionTitle';

import { useSelector } from '../../../slices/store';
import getIcon from '../../../utils/getIcon';
import { selectBoxByName } from '../../../slices/boxes';
import { Typography } from '@mui/joy';

const BoxContent = function () {
    const { type } = useParams<{ type: string }>();

    const box = useSelector((state) => selectBoxByName(state, type));

    return (
        <Page headerTitle={box.name}>
            <Timeline
                sx={{
                    padding: 0,
                    [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                    },
                }}
            >
                {box.days.map((day, dayId) => (
                    <TimelineItem key={dayId}>
                        <TimelineSeparator>
                            <TimelineDot sx={{ bgcolor: 'primary.plainColor' }} />
                            {dayId != box.days.length - 1 && <TimelineConnector color="success" />}
                        </TimelineSeparator>
                        <TimelineContent>
                            <SectionTitle sx={{ mb: 1 }}>{day.name}</SectionTitle>
                            <Typography level="body2" sx={{ mb: 2 }}>
                                Day {dayId + 1}
                            </Typography>
                            <List sx={{ mb: 4 }}>
                                {day.tasks.map((task, taskId) => {
                                    const Icon = task.icon ? getIcon(task.icon) : undefined;

                                    return (
                                        <ListItem
                                            button
                                            key={taskId}
                                            startDecorator={Icon && <Icon />}
                                            endDecorator={<CaretRight />}
                                        >
                                            {task.name}
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </Page>
    );
};

export default BoxContent;
