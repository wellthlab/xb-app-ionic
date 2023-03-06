import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Typography, Card, Stack } from '@mui/joy';
import { CalendarPicker } from '@mui/x-date-pickers';
import {
    Timeline,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSeparator,
    timelineItemClasses,
    TimelineConnector,
} from '@mui/lab';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';

import Box, { IGenericInput, IResponse } from '../../models/Box';
import { useSelector } from '../../slices/store';
import { selectAllBoxesByName } from '../../slices/boxes';
import getIcon from '../../utils/getIcon';

const Journal = function () {
    const [currentDate, setCurrentDate] = React.useState<Dayjs | null>(dayjs());
    const [responses, setResponses] = React.useState<IResponse[]>([]);

    const boxes = useSelector(selectAllBoxesByName);

    React.useEffect(() => {
        if (!currentDate) {
            return;
        }

        const fetchResponses = async function () {
            setResponses(await Box.getResponsesForDate(currentDate.toDate()));
        };

        fetchResponses();
    }, [currentDate]);

    return (
        <Page>
            <PageTitle sx={{ mb: 2 }}>Journal</PageTitle>
            <Typography level="body1" sx={{ mb: 4 }}>
                A summary of what you have done today
            </Typography>
            <Card sx={{ px: 0, py: 1, mb: 4 }}>
                <CalendarPicker date={currentDate} onChange={setCurrentDate} />
            </Card>

            {!responses.length ? (
                <Typography textAlign="center">There's nothing to show here</Typography>
            ) : (
                <Timeline
                    sx={{
                        padding: 0,
                        [`& .${timelineItemClasses.root}:before`]: {
                            flex: 0,
                            padding: 0,
                        },
                    }}
                >
                    {responses.map((response, responseId) => {
                        const box = boxes[response.box];
                        const day = box.days[response.dayId];
                        const task = day.tasks[response.taskId];

                        const Icon = getIcon(box.icon);

                        const payloadEntries = Object.entries(response.payload);

                        const [detectorGreenKey, greenPercentage] =
                            payloadEntries.find(([key]) => key.includes('-$$g')) || [];
                        const [detectorRedKey, redPercentage] =
                            payloadEntries.find(([key]) => key.includes('-$$r')) || [];

                        return (
                            <TimelineItem key={response.id}>
                                <TimelineSeparator>
                                    <TimelineDot>
                                        <Icon />
                                    </TimelineDot>
                                    {responseId != responses.length - 1 && <TimelineConnector />}
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Typography level="h4" mb={1}>
                                        {box.name}
                                    </Typography>
                                    <Typography level="body2" mb={1}>
                                        {day.name} (Day {response.dayId + 1}) / {task.name}
                                    </Typography>
                                    <Typography level="body2" mb={3}>
                                        {dayjs(response.createdAt).format('HH:mm')}
                                    </Typography>
                                    <Stack spacing={1} mb={3}>
                                        {greenPercentage && redPercentage && (
                                            <Typography color="neutral">
                                                Your meal today consisted of {greenPercentage}% green and{' '}
                                                {redPercentage}% red.
                                            </Typography>
                                        )}
                                        {Object.keys(response.payload).map((key) => {
                                            if (key === detectorGreenKey || key === detectorRedKey) {
                                                return;
                                            }

                                            const blockDefinition = task.blocks.find(
                                                (block) => (block as IGenericInput).rk === key,
                                            );

                                            if (!blockDefinition) {
                                                return;
                                            }

                                            return (
                                                <div key={key}>
                                                    <Typography component="span" display="inline" color="neutral">
                                                        "{(blockDefinition as IGenericInput).label}"
                                                    </Typography>{' '}
                                                    {response.payload[key]}
                                                </div>
                                            );
                                        })}
                                    </Stack>
                                </TimelineContent>
                            </TimelineItem>
                        );
                    })}
                </Timeline>
            )}
        </Page>
    );
};

export default Journal;
