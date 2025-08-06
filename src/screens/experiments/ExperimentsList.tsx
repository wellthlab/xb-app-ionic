import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Button, Container, Stack, Typography, Divider, Card, useColorScheme, useTheme, Link } from '@mui/joy';
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
import ReactMarkdown from 'react-markdown';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Sheet from '@mui/joy/Sheet';
import IconButton from '@mui/joy/IconButton';
import CloseIcon from '@mui/icons-material/Close';

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
    const getContent = (block: any) => {
        if (block.type === 'para') {
            return (
                <Typography>
                    {block['content']}
                </Typography>
            );
        }

        if (block.type === 'title') {
            return (
                <Typography>
                    {block['content']}
                </Typography>
            );
        }

        if (block.type === 'video') {
            return <YouTubeVideo src={block.src} />;
        }

        if (block.type === 'image') {
            return (
                <img
                    src={block.src}
                    alt={block.alt}
                    style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                />
            );
        }

        if (block.type === 'expandable') {
            return (
                <Accordion>
                    <AccordionSummary expandIcon={<AddIcon />}>
                        <Typography>
                            {block.title}
                        </Typography>
                    </AccordionSummary>

                    <Divider />

                    <AccordionDetails style={{ backgroundColor: '#eeeeee' }}>
                        <br />
                        <Stack spacing={2}>{block.contents.map((element: any) => getContent(element))}</Stack>
                    </AccordionDetails>
                </Accordion>
            );
        }

        if (block.type === 'markdown') {
            return (
                <ReactMarkdown
                    children={block['content']}
                    components={{
                        h1: ({ children }) => <PageTitle>{children}</PageTitle>,

                        h2: ({ children }) => (
                            <Typography>
                                {children}
                            </Typography>
                        ),
                        li: ({ children }) => <li>{children}</li>,
                        p: ({ children }) => <Typography>{children}</Typography>,

                        a: ({ children, href }) => <Link href={href}>{children}</Link>,

                        img: (props) => {
                            console.log(props.src);
                            return props.src?.startsWith('https://www.youtube.com/embed/') ? (
                                <YouTubeVideo src={props.src} />
                            ) : (
                                <img {...props} />
                            );
                        },
                    }}
                />
            );
        }
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

    return (
        <IonPage>
            {!thisBox.heroImageSrc && <Header title={`${capitalise(type)}`} />}
            <IonContent
                ref={ionContentRef}
                scrollEvents={!!thisBox.heroImageSrc}
                onIonScroll={handleScrollAnimation}
                className="ion-content-custom"
                style={{ '--background': `linear-gradient(to top, rgba(${thisBox.color}) 40%, rgba(0, 0, 0, 0) 70%)` }}
            >
                {thisBox.heroImageSrc && (
                    <Box>
                        <Box
                            ref={titlesRef}
                            sx={{
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
                            </Box>
                        </Box>
                    </Box>
                )}
                <br />
                <Stack alignItems="center">
                    <Accordion
                        sx={{
                            ml: 'auto',
                            mr: 'auto',
                            mt: 0,
                            mb: 0,
                            maxWidth: '500px',
                            width: '90%',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<AddIcon />}
                            sx={{
                                backgroundColor: `rgba(${thisBox.color})`,
                                p: 2
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={4}
                                sx={{
                                    width: '90%',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography level="h1">
                                    Introduction to the {`${capitalise(type)}`} Box
                                </Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            {thisBox.description?.map((item, index) => (
                                <Stack
                                    key={index}
                                    direction="row"
                                    spacing={2}
                                    sx={{
                                        width: '100%',
                                        alignItems: 'center',
                                        mb: 2,
                                    }}
                                >
                                    {item.sectionImageSrc && (
                                        <img
                                            src={item.sectionImageSrc}
                                            alt=""
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    )}

                                    <Link
                                        onClick={() => {
                                            setDrawerContent(item);
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                flex: 1,
                                            }}
                                        >
                                            {item.sectionTitle}
                                            ▶
                                        </Typography>
                                    </Link>
                                </Stack>
                            ))}
                        </AccordionDetails>
                    </Accordion>
                </Stack>

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
                <img src={thisBox.heroImageSrc} alt="Bottom Image" className="bottom-image" />
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
