import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Button, Container, Stack, Typography, Divider, Card, useColorScheme, useTheme } from '@mui/joy';
import { CaretDoubleDown } from 'phosphor-react';

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
import PageTitle from '../../components/foundation/PageTitle';
import { IonContent, IonFooter, IonPage, IonToolbar, ScrollDetail } from '@ionic/react';
import Header from '../../components/foundation/Header';
import HeaderButton from '../../components/foundation/HeaderButton';
import YouTubeVideo from '../../components/TaskModal/YoutubeVideo';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AddIcon from '@mui/icons-material/Add';

const SHOW_HEADER_SCROLL_THRESHOLD = 80;

const ExperimentsListScreen = function () {
    const { type } = useParams<{ type: string }>();
    const colorScheme = useColorScheme();
    const theme = useTheme();

    const thisBox = useSelector((state) => selectBoxByType(state, type));
    const boxExperiments = useSelector((state) => selectExperimentByBoxName(state, type));
    const subscriptions = useSelector(selectSubscriptions);
    const completionByExperimentId = useSelector(selectCompletionForAllExperiments);
    const scheduledExperiments = useSelector(selectScheduledExperiments);
    const scheduledExperimentsByStartTime = new Map<number, IExperiment[]>();
    const getExperimentDescFirstParagraph = () => {
        const paragraphs = thisBox.description!.filter(d => d['type'] === 'para');
        if (paragraphs.length > 0) {
            return paragraphs[0]['content']
        } else {
            return null;
        }
    }
    const getBoxDescription = () => {
        return <Stack spacing={2}>
            {thisBox.description!.map((element) => (
                <div>
                    {getContent(element)}
                </div>
            ))}
        </Stack>;
    }
    const getContent = (block: any) => {
        if (block.type === 'para') {
            return (
                <Typography level="body1">
                    {block['content']}
                </Typography>
            );
        }

        if (block.type === 'title') {
            return (
                <Typography level="h5" sx={{ mb: 2, mt: 2, fontWeight: 'lg' }}>
                    {block['content']}
                </Typography>
            );
        }

        if (block.type === 'video') {
            return <YouTubeVideo src={block.src} />;
        }

        if (block.type === 'image') {
            return <img src={block.src} alt={block.alt} style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />;
        }

        if (block.type === 'expandable') {
            return <Accordion>
                <AccordionSummary expandIcon={<AddIcon />}>
                    <Typography
                        sx={{ mb: 2, mt: 2, fontWeight: 'lg' }}>
                        {block.title}
                    </Typography>
                </AccordionSummary>

                <Divider />

                <AccordionDetails style={{ backgroundColor: '#eeeeee' }}>
                    <br />
                    <Stack spacing={2}>
                        {block.contents.map((element: any) => (
                            getContent(element)
                        ))}
                    </Stack>
                </AccordionDetails>
            </Accordion>;
        }
    };

    const getExperimentsGroupedByCategory = () => {
        const result = new Map();
        Object.keys(ExperimentCategory)
            .forEach((key) => {
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
        return scheduledExperiments.find((schedule) => schedule.experiments.includes(experiment.id))
            ?.startTimeUTC;
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
    }

    return (
        <IonPage>
            {!thisBox.heroImageSrc && <Header title={`${capitalise(type)}`} />}
            <IonContent ref={ionContentRef} scrollEvents={!!thisBox.heroImageSrc} onIonScroll={handleScrollAnimation}>
                {thisBox.heroImageSrc && (
                    <Box
                        sx={{
                            height: 'calc(100dvh - 100px)',
                            backgroundImage: `linear-gradient(${
                                colorScheme.colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.45) 0%' : 'rgba(0, 0, 0, 0) 50%'
                            }, var(--ion-background-color) 95%), url(${thisBox.heroImageSrc})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            pb: 2,
                        }}
                    >
                        <Box
                            ref={titlesRef}
                            sx={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                zIndex: 10,
                                pt: 1,
                                pb: 1.5,
                                px: 2,
                                borderBottomWidth: showHeader ? 1 : 0,
                                borderBottomStyle: 'solid',
                                borderColor: 'divider',
                                overflow: 'hidden',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ flex: 1 }}>
                                    <HeaderButton onClick={handleGoBack}>Back</HeaderButton>
                                    <PageTitle
                                        sx={{ mb: 0, transition: 'font-size 0.2s', fontWeight: 'lg' }}
                                        level={showHeader ? 'h3' : 'h2'}
                                    >
                                        {capitalise(type)}
                                    </PageTitle>
                                </Box>
                                <Box
                                    sx={{
                                        // display: showHeader ? 'block' : 'none',
                                        height: 44,
                                        width: 44,
                                        borderRadius: '50%',
                                        backgroundImage: `url(${thisBox.heroImageSrc})`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        transition: `transform 0.3s, opacity 0.2s`,
                                        transform: showHeader ? `translate3d(0, 0, 0)` : `translate3d(0, 150%, 0)`,
                                        opacity: showHeader ? 1 : 0,
                                    }}
                                />
                            </Box>
                        </Box>

                        <div></div>

                        <Button
                            variant="plain"
                            color="neutral"
                            startDecorator={<CaretDoubleDown />}
                            sx={{ flexDirection: 'column', gap: 1, alignSelf: 'center' }}
                            onClick={handleClickScroll}
                        >
                            Scroll down
                        </Button>
                    </Box>
                )}
                <br />
                {thisBox.description && !thisBox.heroImageSrc && (
                    <React.Fragment>
                        <PageTitle sx={{ mb: 0 }}>{capitalise(type)}</PageTitle>
                        <Typography level="h6" sx={{ mb: 4 }}>
                            {getExperimentDescFirstParagraph()}
                        </Typography>
                    </React.Fragment>
                )}
                {thisBox.description &&
                    <Card variant="plain" ref={mainSectionRef}
                          sx={{
                              alignSelf: 'center',
                              ml: 10,
                              mr: 10,
                          }}>{getBoxDescription()}</Card>}

                <br />
                <br />

                <Container >
                    <Stack spacing={2}>
                        {type === 'move' && <ExerciseWarning />}
                        <ExperimentsList
                            key={type}
                            experimentsGroupedByCategory={experimentsGroupedByCategory}
                            scheduledExperimentsByStartTime={scheduledExperimentsByStartTime}
                        />
                        <br />
                    </Stack>
                </Container>
            </IonContent>
            <IonFooter>
                <IonToolbar>
                <BoxesSubMenu />
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default ExperimentsListScreen;
