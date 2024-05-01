import Strings from '../../utils/string_dict.js';
import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import {
    Typography,
    Card,
    Stack,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabsProps,
    IconButton,
    Button,
    ListDivider,
} from '@mui/joy';
import { DateCalendar, DateCalendarProps, DateTimeField } from '@mui/x-date-pickers';
import {
    Timeline,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSeparator,
    timelineItemClasses,
    TimelineConnector,
} from '@mui/lab';
import { Collapse, InputAdornment } from '@mui/material';
import { Calendar, CaretDown } from 'phosphor-react';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';

import Experiment, { IExperiment, IGenericInput, IResponse } from '../../models/Experiment';
import { useSelector } from '../../slices/store';
import { selectAllExperiments } from '../../slices/experiments';
import List from '../../components/foundation/List';
import ListItem from '../../components/foundation/ListItem';
import Modal from '../../components/foundation/Modal';
import Textarea from '../../components/foundation/Textarea';

const Journal = function () {
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleTabChange: TabsProps['onChange'] = function (_, value) {
        setTabIndex(value as number);
    };

    const [currentDate, setCurrentDate] = React.useState<Dayjs | null>(dayjs());
    const [showCalendar, setShowCalendar] = React.useState(false);

    const handleToggleCalendar = function () {
        setShowCalendar(!showCalendar);
    };

    const handleChangeDate: DateCalendarProps<Dayjs>['onChange'] = function (date) {
        setCurrentDate(date);
        setShowCalendar(false);
    };

    const [openStates, setOpenStates] = React.useState({ note: true, activity: false });

    const createHandleToggle = function (key: 'note' | 'activity') {
        return () => setOpenStates({ ...openStates, [key]: !openStates[key] });
    };

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();
    const [isAddingNote, setIsAddingNote] = React.useState(false);

    const handleAddNote = function () {
        setIsAddingNote(true);
    };

    const handleDismiss = function () {
        setIsAddingNote(false);
    };

    const [responses, setResponses] = React.useState<IResponse[]>([]);

    const experiments = useSelector(selectAllExperiments);

    // React.useEffect(() => {
    //     if (!currentDate) {
    //         return;
    //     }
    //
    //     const fetchResponses = async function () {
    //         const raw = await Experiment.getResponsesForDate(currentDate.toDate());
    //
    //         const responses = [];
    //
    //         let has{Strings.note}s = false;
    //
    //         for (const response of raw) {
    //             if (!response.experimentId) {
    //                 has{Strings.note}s = true;
    //                 const current{Strings.note} = response.payload.note as string;
    //                 set{Strings.note}(current{Strings.note});
    //                 set{Strings.note}Value(current{Strings.note});
    //                 continue;
    //             }
    //
    //             responses.push(response);
    //         }
    //
    //         if (!has{Strings.note}s) {
    //             set{Strings.note}('');
    //             set{Strings.note}Value('');
    //         }
    //
    //         setResponses(responses);
    //     };
    //
    //     fetchResponses();
    // }, [currentDate]);

    const [note, setNote] = React.useState('');
    const [noteValue, setNoteValue] = React.useState('');

    const handleChangeNote = function (e: React.ChangeEvent<HTMLTextAreaElement>) {
        setNoteValue(e.target.value);
    };

    const handleSubmitNote = async function () {
        await Experiment.saveNote(noteValue);
        setNote(noteValue);
        setIsAddingNote(false);
    };

    return (
        <Page ref={setPresentingElement}>
            <PageTitle sx={{ mb: 2 }}>Journal</PageTitle>
            <Typography level="body1" sx={{ mb: 4 }}>
                {Strings.a_summary_of_what_you_have}
            </Typography>

            <Tabs aria-label={Strings.journal_tabs} value={tabIndex} onChange={handleTabChange} sx={{ bgcolor: 'transparent' }}>
                <TabList>
                    <Tab variant={tabIndex === 0 ? 'solid' : 'plain'} color={tabIndex === 0 ? 'primary' : 'neutral'}>
                        {Strings.daily}
                    </Tab>
                    <Tab variant={tabIndex === 1 ? 'solid' : 'plain'} color={tabIndex === 1 ? 'primary' : 'neutral'}>
                        {Strings.weekly}
                    </Tab>
                </TabList>
                <TabPanel value={0}>
                    <DateTimeField
                        value={currentDate}
                        onChange={setCurrentDate}
                        sx={{ mt: 2 }}
                        format="DD/MM/YYYY"
                        fullWidth
                        slotProps={{
                            textField: {
                                InputProps: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton variant="plain" color="neutral" onClick={handleToggleCalendar}>
                                                <Calendar />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            },
                        }}
                    />

                    <Collapse in={showCalendar}>
                        <Card sx={{ px: 0, py: 1, mt: 2, overflow: 'hidden' }}>
                            <DateCalendar value={currentDate} onChange={handleChangeDate} />
                        </Card>
                    </Collapse>

                    <List noDividers sx={{ mt: 2 }}>
                        <ListItem button startDecorator={<CaretDown />} onClick={createHandleToggle('note')}>
                            {Strings.note}
                        </ListItem>

                        <Collapse in={openStates.note}>
                            <ListDivider />
                            <ListItem sx={{ p: 2 }}>
                                <Stack spacing={2}>
                                    <Typography>{note || Strings.you_did_not_have_any_notes}</Typography>
                                    <Button variant="outlined" onClick={handleAddNote}>
                                        {Strings.add_a_note}
                                    </Button>
                                </Stack>
                            </ListItem>
                        </Collapse>

                        <ListDivider />
                        <ListItem button startDecorator={<CaretDown />} onClick={createHandleToggle('activity')}>
                            {Strings.activity}
                        </ListItem>

                        <Collapse in={openStates.activity}>
                            <ListDivider />
                            <ListItem sx={{ p: 2 }}>
                                {!responses.length ? (
                                    Strings.you_did_not_have_any
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
                                            // if (!response.experimentId) {
                                            //     return null;
                                            // }

                                            if (false) {
                                                return null;
                                            }


                                            // const experiment = experiments[response.experimentId] as IExperiment; // Parent experiment cannot have responses, so we can safely cast here
                                            // const day = experiment.days[response.dayId];
                                            // const task = day.tasks[response.taskId];
                                            const experiment = experiments[0] as IExperiment; // Parent experiment cannot have responses, so we can safely cast here
                                            const day = experiment.days[0];
                                            const task = day.tasks[0];

                                            const payloadEntries = Object.entries(response.payload);

                                            const [detectorGreenKey, greenPercentage] =
                                                payloadEntries.find(([key]) => key.includes('-$$g')) || [];
                                            const [detectorRedKey, redPercentage] =
                                                payloadEntries.find(([key]) => key.includes('-$$r')) || [];

                                            return (
                                                <TimelineItem key={response.id}>
                                                    <TimelineSeparator>
                                                        <TimelineDot />
                                                        {responseId !== responses.length - 1 && <TimelineConnector />}
                                                    </TimelineSeparator>
                                                    <TimelineContent>
                                                        <Typography level="h4" mb={1}>
                                                            {experiment.name}
                                                        </Typography>
                                                        <Typography level="body2" mb={1}>
                                                            {/*{day.name} (Day {response.dayId + 1}) / {task.name}*/}
                                                            {day.name} (Day {0}) / {task.name}

                                                        </Typography>
                                                        <Typography level="body2" mb={3}>
                                                            {dayjs(response.createdAt).format('HH:mm')}
                                                        </Typography>
                                                        <Stack spacing={1} mb={3}>
                                                            {greenPercentage && redPercentage && (
                                                                <Typography color="neutral">
                                                                    {Strings.your_meal_today_consisted_of}
                                                                    {greenPercentage}
                                                                    {Strings.your_meal_today_consisted_of_2}
                                                                    {redPercentage}
                                                                    {Strings.your_meal_today_consisted_of_3}
                                                                </Typography>
                                                            )}
                                                            {Object.keys(response.payload).map((key) => {
                                                                if (
                                                                    key === detectorGreenKey ||
                                                                    key === detectorRedKey
                                                                ) {
                                                                    return null;
                                                                }

                                                                const blockDefinition = task.blocks.find(
                                                                    (block) => (block as IGenericInput).rk === key,
                                                                );

                                                                if (!blockDefinition) {
                                                                    return null;
                                                                }

                                                                return (
                                                                    <div key={key}>
                                                                        <Typography
                                                                            component="span"
                                                                            display="inline"
                                                                            color="neutral"
                                                                        >
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
                            </ListItem>
                        </Collapse>
                    </List>
                </TabPanel>
                <TabPanel value={1} sx={{ p: 2 }}>
                    {Strings.sorry_we_do_not_have_any_data}
                </TabPanel>
            </Tabs>

            <Modal
                headerTitle={Strings.add_a_note}
                isOpen={isAddingNote}
                presentingElement={presentingElement}
                onDismiss={handleDismiss}
                onAction={handleSubmitNote}
            >
                <Stack spacing={2}>
                    <Typography level="body2">
                        {Strings.feel_free_to_jot_down}
                    </Typography>

                    <Textarea
                        label={Strings.note}
                        placeholder={Strings.a_note_to_your_future_self}
                        minRows={5}
                        maxRows={14}
                        value={noteValue}
                        onChange={handleChangeNote}
                    />
                </Stack>
            </Modal>
        </Page>
    );
};

export default Journal;
