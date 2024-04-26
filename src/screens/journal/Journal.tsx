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

import { IExperiment, IGenericInput, IResponse } from '../../models/Experiment';
import { useDispatch, useSelector } from '../../slices/store';
import { selectAllExperiments, selectExperimentById } from '../../slices/experiments';
import List from '../../components/foundation/List';
import ListItem from '../../components/foundation/ListItem';
import Modal from '../../components/foundation/Modal';
import Textarea from '../../components/foundation/Textarea';
import { saveNotes, selectNotes, selectResponses, selectSubscriptions } from '../../slices/account';

const Journal = function () {
    const dispatch = useDispatch();
    const notes = useSelector((state) => selectNotes(state));
    const allResponses = useSelector((state) => selectResponses(state));

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
    const subscriptions = useSelector(selectSubscriptions);

    const [displayedNote, setDisplayedNote] = React.useState('');
    const [editableNote, setEditableNote] = React.useState('');

    React.useEffect(() => {
        if (!currentDate) {
            return;
        }

        const fetchResponses = async function () {
            const startDate = new Date(currentDate.toDate());
            startDate.setUTCHours(0, 0, 0, 0);

            const endDate = new Date(currentDate.toDate());
            endDate.setUTCHours(23, 59, 59, 9999);

            const responses =  Object.values(allResponses).flat().filter(s =>  s.createdAt  >= startDate.getTime() && s.createdAt <=  endDate.getTime());
            setResponses(responses);
        };

        const noteForDisplay = notes[getNoteDate()];
        if (noteForDisplay) {
            setEditableNote(noteForDisplay);
            setDisplayedNote(noteForDisplay);
        } else {
            setEditableNote('');
            setDisplayedNote('');
        }

        fetchResponses();
    }, [currentDate]);


    const handleChangeNote = function (e: React.ChangeEvent<HTMLTextAreaElement>) {
        setEditableNote(e.target.value);
    };

    const handleSubmitNote = async function () {
        if (!currentDate) {
            return;
        }

        const updateNotes = JSON.parse(JSON.stringify(notes));
        updateNotes[getNoteDate()] = editableNote;
        dispatch(saveNotes(updateNotes));
        setDisplayedNote(editableNote);
        setIsAddingNote(false);
    };

    const getNoteDate = () => {
        return  new Date(currentDate!.toDate()).setUTCHours(0, 0, 0, 0);
    }

    return (
        <Page ref={setPresentingElement}>
            <PageTitle sx={{ mb: 2 }}>Journal</PageTitle>
            <Typography level="body1" sx={{ mb: 4 }}>
                A summary of what you have done so far
            </Typography>

            <Tabs aria-label="Journal tabs" value={tabIndex} onChange={handleTabChange} sx={{ bgcolor: 'transparent' }}>
                <TabList>
                    <Tab variant={tabIndex === 0 ? 'solid' : 'plain'} color={tabIndex === 0 ? 'primary' : 'neutral'}>
                        Daily
                    </Tab>
                    <Tab variant={tabIndex === 1 ? 'solid' : 'plain'} color={tabIndex === 1 ? 'primary' : 'neutral'}>
                        Weekly
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
                            Note
                        </ListItem>

                        <Collapse in={openStates.note}>
                            <ListDivider />
                            <ListItem sx={{ p: 2 }}>
                                <Stack spacing={2}>
                                    <Typography>{displayedNote || 'You did not have any note for this day'}</Typography>
                                    <Button variant="outlined" onClick={handleAddNote}>
                                        Add a note
                                    </Button>
                                </Stack>
                            </ListItem>
                        </Collapse>

                        <ListDivider />
                        <ListItem button startDecorator={<CaretDown />} onClick={createHandleToggle('activity')}>
                            Activity
                        </ListItem>

                        <Collapse in={openStates.activity}>
                            <ListDivider />
                            <ListItem sx={{ p: 2 }}>
                                {!responses.length ? (
                                    'You did not have any activity for this day'
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
                                        {responses.map((response, responseIndex) => {

                                            const correspondingSubcription = Object.values(subscriptions).find(subscription => subscription.id === response.subscriptionId);
                                            const experiment = experiments[correspondingSubcription!.experimentId] as IExperiment; // Parent experiment cannot have responses, so we can safely cast here
                                            const day = experiment.days[response.dayNum];
                                            const task = day.tasks.find(task => task.taskId === response.taskId);
                                            const payloadEntries = Object.entries(response.payload);

                                            const [detectorGreenKey, greenPercentage] =
                                                payloadEntries.find(([key]) => key.includes('-$$g')) || [];
                                            const [detectorRedKey, redPercentage] =
                                                payloadEntries.find(([key]) => key.includes('-$$r')) || [];

                                            return (
                                                <TimelineItem key={response.id}>
                                                    <TimelineSeparator>
                                                        <TimelineDot />
                                                        {responseIndex !== responses.length - 1 && <TimelineConnector />}
                                                    </TimelineSeparator>
                                                    <TimelineContent>
                                                        <Typography level="h4" mb={1}>
                                                            {experiment.name}
                                                        </Typography>
                                                        <Typography level="body2" mb={1}>
                                                            {day.name} (Day {response.dayNum + 1}) / {task!.name}
                                                        </Typography>
                                                        <Typography level="body2" mb={3}>
                                                            {dayjs(response.createdAt).format('HH:mm')}
                                                        </Typography>
                                                        <Stack spacing={1} mb={3}>
                                                            {greenPercentage && redPercentage && (
                                                                <Typography color="neutral">
                                                                    Your meal today consisted of {greenPercentage}%
                                                                    green and {redPercentage}% red.
                                                                </Typography>
                                                            )}
                                                            {Object.keys(response.payload).map((key) => {
                                                                if (
                                                                    key === detectorGreenKey ||
                                                                    key === detectorRedKey
                                                                ) {
                                                                    return null;
                                                                }

                                                                const blockDefinition = task!.blocks.find(
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
                    Sorry, we do not have any data for now
                </TabPanel>
            </Tabs>

            <Modal
                headerTitle="Add a note"
                isOpen={isAddingNote}
                presentingElement={presentingElement}
                onDismiss={handleDismiss}
                onAction={handleSubmitNote}
            >
                <Stack spacing={2}>
                    <Typography level="body2">
                        Feel free to jot down anything that you want to look back for this day. It is for your use only,
                        and feel free to edit it anytime.
                    </Typography>

                    <Textarea
                        label="Note"
                        placeholder="A note to your future self"
                        minRows={5}
                        maxRows={14}
                        value={editableNote}
                        onChange={handleChangeNote}
                    />
                </Stack>
            </Modal>
        </Page>
    );
};

export default Journal;
