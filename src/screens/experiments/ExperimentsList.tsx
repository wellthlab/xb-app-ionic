import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Stack, Typography, useColorScheme, Box, AspectRatio } from '@mui/joy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import capitalise from './utils/capitalise';
import ExperimentsList from './components/ExperimentsList';
import ExerciseWarning from '../../components/ExerciseWarning';

import { useSelector } from '../../slices/store';
import {
    selectBoxByType,
    selectCompletionForAllExperiments,
    selectExperimentByBoxName,
} from '../../slices/experiments';
import { ExperimentCategory, IExperiment } from '../../models/Experiment';
import { selectScheduledExperiments, selectSubscriptions } from '../../slices/account';
import BoxesSubMenu from './BoxesSubMenu';
import { IonContent, IonFooter, IonPage, IonToolbar, ScrollDetail } from '@ionic/react';
import Header from '../../components/foundation/Header';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AddIcon from '@mui/icons-material/Add';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Sheet from '@mui/joy/Sheet';
import IconButton from '@mui/joy/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import getContent from './utils/getContent';

const SHOW_HEADER_SCROLL_THRESHOLD = 80;

const ExperimentsListScreen = function () {
    const { type } = useParams<{ type: string }>();
    const colorScheme = useColorScheme();

    const thisBox = useSelector((state) => selectBoxByType(state, type));
    const boxExperiments = useSelector((state) => selectExperimentByBoxName(state, type));
    const subscriptions = useSelector(selectSubscriptions);
    const completionByExperimentId = useSelector(selectCompletionForAllExperiments);
    const scheduledExperiments = useSelector(selectScheduledExperiments);
    const scheduledExperimentsByStartTime = new Map<number, IExperiment[]>();
    const [drawerContent, setDrawerContent] = React.useState<any | null>(null);

    const getExperimentDescFirstParagraph = () => {
        const paragraphs = thisBox.description!.filter((d) => d['type'] === 'para');
        if (paragraphs.length > 0) {
            return paragraphs[0]['content'];
        } else {
            return null;
        }
    };
    const getBoxDescription = () => {
        return (
            <Stack spacing={2}>
                {thisBox.description!.map((element) => (
                    <div>{getContent(element)}</div>
                ))}
            </Stack>
        );
    };

    const getExperimentsGroupedByCategory = () => {
        const result = new Map();
        Object.keys(ExperimentCategory).forEach((key) => {
            result.set(key, []);
        });

        boxExperiments.reduce((map, experiment) => {
            if (iSubscribedToExperiment(experiment)) {
                if (isExperimentComplete(experiment)) {
                    result.get(ExperimentCategory.COMPLETED.valueOf()).push(experiment);
                } else {
                    result.get(ExperimentCategory.ACTIVE.valueOf()).push(experiment);
                }
            } else if (isExperimentAvailable(experiment)) {
                const scheduledStartTime = getScheduledStartTime(experiment);
                if (scheduledStartTime) {
                    scheduledExperimentsByStartTime.has(scheduledStartTime)
                        ? scheduledExperimentsByStartTime.get(scheduledStartTime)!.push(experiment)
                        : scheduledExperimentsByStartTime.set(scheduledStartTime, [experiment]);
                } else if (isExperimentSuggested(experiment)) {
                    result.get(ExperimentCategory.SUGGESTED.valueOf()).push(experiment);
                } else {
                    result.get(ExperimentCategory.AVAILABLE.valueOf()).push(experiment);
                }
            }
            return map;
        }, result);
        return result;
    };

    const isExperimentComplete = (experiment: IExperiment) => {
        return completionByExperimentId[experiment.id] === 100;
    };

    const isExperimentAvailable = (experiment: IExperiment) => {
        return !experiment.hidden;
    };

    const isExperimentSuggested = (experiment: IExperiment) => {
        return experiment.isSuggested;
    };

    const getScheduledStartTime = (experiment: IExperiment) => {
        return scheduledExperiments.find((schedule) =>
            schedule.experiments.map((e) => e.toString()).includes(experiment.id),
        )?.startTimeUTC;
    };

    const iSubscribedToExperiment = (experiment: IExperiment) => {
        return Object.keys(subscriptions).includes(experiment.id);
    };

    const experimentsGroupedByCategory = getExperimentsGroupedByCategory();

    const ionContentRef = React.useRef<HTMLIonContentElement>(null);
    const mainSectionRef = React.useRef<HTMLDivElement>(null);

    const handleClickScroll = function () {
        if (ionContentRef.current && mainSectionRef.current) {
            const offsetTop = mainSectionRef.current.offsetTop;
            ionContentRef.current.scrollToPoint(0, offsetTop - 100, 500);
        }
    };

    const [showHeader, setShowHeader] = React.useState(false);
    const titlesRef = React.useRef<HTMLDivElement>(null);

    const handleScrollAnimation = function (e: CustomEvent<ScrollDetail>) {
        if (e.detail.scrollTop > SHOW_HEADER_SCROLL_THRESHOLD) {
            setShowHeader(true);
        } else {
            setShowHeader(false);
        }

        // Animate titles imperatively using DOM manipulations to avoid excessive React re-renders

        if (titlesRef.current) {
            const opacity = Math.min(e.detail.scrollTop / SHOW_HEADER_SCROLL_THRESHOLD, 0.9);
            const blur = Math.min(e.detail.scrollTop / SHOW_HEADER_SCROLL_THRESHOLD, 1) * 8;
            titlesRef.current.style.backgroundColor = `rgb(${
                colorScheme.colorScheme === 'dark' ? '19 19 24' : '255 255 255'
            } / ${opacity})`;
            titlesRef.current.style.backdropFilter = `blur(${blur}px)`;
        }
    };

    const history = useHistory();
    const handleGoBack = function () {
        history.goBack();
    };

    // TODO: Color has been removed as an option from Vite so reverting to a Switch statement. This variable should be stored on Vite because this is currently very brittle.

    let pageBackgroundColor = '';

    switch (thisBox.name.toLowerCase()) {
        case 'move':
            pageBackgroundColor = 'var(--box-background-move)';
            break;
        case 'eat':
            pageBackgroundColor = 'var(--box-background-eat)';
            break;
        case 'sleep':
            pageBackgroundColor = 'var(--box-background-sleep)';
            break;
        case 'base box':
            pageBackgroundColor = 'var(--box-background-base)';
            break;
        case 'journal':
            pageBackgroundColor = 'var(--box-background-journal)';
            break;
        default:
            pageBackgroundColor = 'var(--joy-palette-neutral-50)';
    }

    return (
        <IonPage>
            {!thisBox.heroImageSrc && <Header title={`${capitalise(type)}`} />}
            <IonContent
                ref={ionContentRef}
                scrollEvents={!!thisBox.heroImageSrc}
                onIonScroll={handleScrollAnimation}
                className="ion-content-custom"
                style={{ '--background': pageBackgroundColor }}
            >
                <IconButton
                    onClick={() => history.push('/main/box')}
                    aria-label="go back"
                    size="lg"
                    sx={{
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,.8)',
                        color: 'primary',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,1)',
                        },
                        ml: '5%',
                        mt: 2,
                        mb: 3,
                    }}
                >
                    <ArrowBackIcon fontSize="inherit" />
                </IconButton>

                <Box
                    sx={{
                        mx: 'auto',
                        width: '100%',
                        maxWidth: '500px',
                        px: 2,
                    }}
                >
                    <Accordion
                        sx={{
                            width: '100%',
                            backgroundColor: 'rgba(255,255,255,.8)',
                            borderRadius: 2,
                            mb: 2,
                        }}
                    >
                        <AccordionSummary expandIcon={<AddIcon />} sx={{ backgroundColor: 'transparent' }}>
                            <Typography level="h1">Introduction to the {capitalise(type)} Box</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ backgroundColor: 'transparent', width: '100%' }}>...</AccordionDetails>
                    </Accordion>
                </Box>

                <ExperimentsList
                    key={type}
                    color={thisBox.color}
                    experimentsGroupedByCategory={experimentsGroupedByCategory}
                    scheduledExperimentsByStartTime={scheduledExperimentsByStartTime}
                    beginAtUserStartOfWeek={thisBox.beginAtUserStartOfWeek}
                />

                {type === 'move' && <ExerciseWarning />}

                <SwipeableDrawer
                    anchor="bottom"
                    open={!!drawerContent}
                    onClose={() => setDrawerContent(null)}
                    onOpen={() => {}}
                    disableSwipeToOpen={true}
                    sx={{
                        '--Drawer-horizontalSize': '500px',
                        '& .MuiDrawer-paper': {
                            borderTopLeftRadius: '20px',
                            borderTopRightRadius: '20px',
                            height: '95vh',
                        },
                    }}
                >
                    <Sheet
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                        }}
                    >
                        <IconButton
                            onClick={() => setDrawerContent(null)}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                bgcolor: 'transparent',
                                '&:hover': {
                                    bgcolor: 'transparent',
                                },
                            }}
                        >
                            <CloseIcon sx={{ color: 'black' }} />
                        </IconButton>
                        <Stack spacing={2}>
                            {drawerContent &&
                                drawerContent.sectionContent.map((element: any) => <div>{getContent(element)}</div>)}
                        </Stack>
                    </Sheet>
                </SwipeableDrawer>
                <AspectRatio ratio="1">
                    <img src={thisBox.heroImageSrc + '.svg'} alt="" />
                </AspectRatio>
            </IonContent>
            <IonFooter className="ion-no-border">
                <IonToolbar>
                    <BoxesSubMenu />
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default ExperimentsListScreen;
