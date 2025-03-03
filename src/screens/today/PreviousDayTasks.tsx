import { SwipeableDrawer } from "@mui/material";
import { Button, Stack, Typography } from '@mui/joy';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';

import {
    Divider,
    ListDivider,
    List,
    ListItem,
    ListItemContent,
    Card,
} from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import Sheet from '@mui/joy/Sheet';
import IconButton from "@mui/joy/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import Carousel from 'react-material-ui-carousel'
import EntryIcon from './EntryIcon';
import Strings from '../../utils/string_dict';
import TasksList from '../../components/TasksList';
import { IExperiment } from '../../models/Experiment';
import {
    selectAllBoxes,
    selectAllExperiments,
    selectTodaysTasks, selectPreviousDayTasks,
} from '../../slices/experiments';
import { useSelector } from '../../slices/store';
import Page from '../../components/foundation/Page';
import TaskModal from '../../components/TaskModal';


const PreviousDayTasks = function () {
    let previousDayTasks = useSelector(selectPreviousDayTasks);

    const history = useHistory();
    const boxes = useSelector(selectAllBoxes);

    const selectBoxName = (boxId: string) => boxes.find(box => box.id === boxId)!.name;

    const [presentingElement, setPresentingElement] = React.useState<HTMLElement>();
    const [modalOpen, setModalOpen] = React.useState(false);
    const [experimentId, setExperimentId] = React.useState<string>('');
    const [dayNum, setDayNum] = React.useState<number>(0);
    const [taskNum, setTaskNum] = React.useState(0);

    const [reflectionModalOpen, setReflectionModalOpen] = React.useState(false);
    const [reflectionExperimentId, setReflectionExperimentId] = React.useState<string>('');
    const [reflectionDayNum, setReflectionDayNum] = React.useState<number>(0);
    const [reflectionTaskNum, setReflectionTaskNum] = React.useState(0);
    
    const handleDismissModal = function(type: string) {
        if (type === 'normal') {
            setModalOpen(false);
        } else {
            setReflectionModalOpen(false);
        }
    };

    const handleClickTask = function(experimentId: string, dayNum: number, taskNum: number, type: string) {
        if (type === 'normal') {
            setModalOpen(true);
            setExperimentId(experimentId);
            setDayNum(dayNum);
            setTaskNum(taskNum);
        } else {
            setReflectionModalOpen(true);
            setReflectionExperimentId(experimentId);
            setReflectionDayNum(dayNum);
            setReflectionTaskNum(taskNum);
        }
    };


    const getReflectionTasks = (experiment: IExperiment) => {
        return experiment.days[0].tasks.filter(task => task.type === 'reflection');
    };

    return (

        <Page headerTitle={"Pending Tasks"}>
           <Stack spacing={4}>
               {

                   previousDayTasks.map( (unfinishedTask, i) =>
                       <Card>
                           <Stack spacing={2}  key={unfinishedTask.experiment.id}>
                               <Stack spacing={2} direction="row" alignItems="left">
                                   <EntryIcon experimentId={unfinishedTask.experiment.id} dayNum={unfinishedTask.day} />

                                   <div>
                                       <Button sx={{fontSize: '0.8rem'}} color="neutral" size="sm" variant="soft" onClick={() => history.push(`/main/box/${selectBoxName(unfinishedTask.experiment.boxId)}/${unfinishedTask.experiment.id}`)}>{unfinishedTask.experiment.name}</Button>
                                       <Typography level="body2">
                                           {Strings.day} {unfinishedTask.day + 1}
                                       </Typography>
                                   </div>
                               </Stack>

                               <Stack spacing={2}>

                                   <Accordion variant="outlined">
                                       <AccordionSummary expandIcon={<AddIcon />}
                                       >
                                           <Typography level="h6" sx={{ mb: 2, mt: 2, fontWeight: 'lg', fontSize: '0.7rem' }}>
                                               {Strings.checks}
                                           </Typography>
                                       </AccordionSummary>
                                       <Divider />
                                       <AccordionDetails style={{ backgroundColor: '#eeeeee' }} sx={{padding: 0}}>
                                           <Stack spacing={2}>
                                               <TasksList
                                                   tasks={unfinishedTask.experiment.days[unfinishedTask.day].tasks}
                                                   experimentId={unfinishedTask.experiment.id}
                                                   type={'normal'}
                                                   dayNum={unfinishedTask.day}
                                                   onTaskClick={handleClickTask}
                                               />
                                           </Stack>
                                       </AccordionDetails>
                                   </Accordion>

                                   {getReflectionTasks(unfinishedTask.experiment).length !== 0 && <Accordion variant="outlined">
                                       <AccordionSummary expandIcon={<AddIcon />}
                                       >
                                           <Typography level="h6" sx={{ mb: 2, mt: 2, fontWeight: 'lg', fontSize: '0.7rem' }}>
                                               {Strings.reflections}
                                           </Typography>
                                       </AccordionSummary>
                                       <Divider />
                                       <AccordionDetails style={{ backgroundColor: '#eeeeee' }} sx={{padding: 0}}>
                                           <Stack spacing={2}>
                                               <TasksList
                                                   tasks={unfinishedTask.experiment.days[unfinishedTask.day].tasks}
                                                   experimentId={unfinishedTask.experiment.id}
                                                   dayNum={unfinishedTask.day}
                                                   type={'reflection'}
                                                   onTaskClick={handleClickTask}
                                               />
                                           </Stack> </AccordionDetails>
                                   </Accordion>}
                               </Stack>
                           </Stack>
                       </Card>

                   )
               }
            </Stack>


            {experimentId && <TaskModal
                isOpen={modalOpen}
                onDismiss={() => handleDismissModal('normal')}
                key={`${experimentId}.${dayNum}.${taskNum}`}
                experimentId={experimentId}
                dayNum={dayNum}
                taskNum={taskNum}
                presentingElement={presentingElement}
                isSubscribed={true}
            />}

            {reflectionExperimentId && <TaskModal
                isOpen={reflectionModalOpen}
                onDismiss={() => handleDismissModal('reflection')}
                key={`${reflectionExperimentId}.${reflectionDayNum}.${reflectionTaskNum}`}
                experimentId={reflectionExperimentId}
                dayNum={reflectionDayNum}
                taskNum={reflectionTaskNum}
                presentingElement={presentingElement}
                isSubscribed={true}
            />}
    </Page>);
}
export default PreviousDayTasks;
