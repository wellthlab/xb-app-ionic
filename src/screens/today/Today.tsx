import Strings from '../../utils/string_dict.js';
import React from 'react';
import { Stack, Typography } from '@mui/joy';

import EntryIcon from './EntryIcon';
import CollapsibleInstructions from './CollapsibleInstructions';

import TasksList from '../../components/TasksList';
import TaskModal from '../../components/TaskModal';
import Centre from '../../components/foundation/Centre';
import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';

import { useSelector } from '../../slices/store';
import { selectTodaysTasks } from '../../slices/experiments';

const Today = function () {
    const tasksByExperiment = useSelector(selectTodaysTasks);

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();
    const [modalOpen, setModalOpen] = React.useState(false);

    const [experimentId, setExperimentId] = React.useState<string>();
    const [dayNum, setDayNum] = React.useState<number>();
    const [taskNum, setTaskNum] = React.useState(0);

    if (!tasksByExperiment.length) {
        return (
            <Page>
                <Centre>
                    <Stack spacing={1}>
                        <Typography level="h6" component="p">
                            {Strings.you_havent_got_any_task_today}
                        </Typography>

                        <Typography level="body2" textAlign="center">
                            {Strings.explore_what_you_can_do_in}
                        </Typography>
                    </Stack>
                </Centre>
            </Page>
        );
    }

    const handleDismissModal = function () {
        setModalOpen(false);
    };

    const handleClickTask = function (experimentId: string, dayNum: number, taskNum: number) {
        setModalOpen(true);
        setExperimentId(experimentId);
        setDayNum(dayNum);
        setTaskNum(taskNum);
    };

    const safeExperimentId = experimentId || tasksByExperiment[0].id;
    const safeDayNum = dayNum === undefined ? tasksByExperiment[0].day : dayNum;

    return (
        <Page ref={setPresentingElement}>
            <PageTitle>{Strings.todays_experiments}</PageTitle>

            <Stack spacing={4}>
                {tasksByExperiment.map((entry) => (
                    <Stack spacing={2} key={entry.id}>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <EntryIcon experimentId={entry.id} dayNum={entry.day} />

                            <div>
                                <Typography level="h4">{entry.name}</Typography>
                                <Typography level="body2">{Strings.day} {entry.day + 1}</Typography>
                            </div>
                        </Stack>

                        {entry.instructions && <CollapsibleInstructions instructions={entry.instructions} />}

                        <TasksList
                            tasks={entry.content.tasks}
                            dayNum={entry.day}
                            experimentId={entry.id}
                            onTaskClick={handleClickTask}
                        />
                    </Stack>
                ))}
            </Stack>

            <TaskModal
                isOpen={modalOpen}
                onDismiss={handleDismissModal}
                key={`${safeExperimentId}.${safeDayNum}.${taskNum}`}
                experimentId={safeExperimentId}
                dayNum={safeDayNum}
                taskNum={taskNum}
                presentingElement={presentingElement}
                isSubscribed={true}
            />
        </Page>
    );
};

export default Today;
