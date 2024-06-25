import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Button, Container, Stack, Typography } from '@mui/joy';
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
import { ExperimentCategory, GenericExperiment } from '../../models/Experiment';
import { selectCohort, selectSubscriptions } from '../../slices/account';
import BoxesSubMenu from './BoxesSubMenu';
import PageTitle from '../../components/foundation/PageTitle';
import { IonContent, IonFooter, IonPage, IonToolbar, ScrollDetail } from '@ionic/react';
import Header from '../../components/foundation/Header';
import HeaderButton from '../../components/foundation/HeaderButton';

const SHOW_HEADER_SCROLL_THRESHOLD = 80;

const ExperimentsListScreen = function () {
    const { type } = useParams<{ type: string }>();

    const thisBox = useSelector((state) => selectBoxByType(state, type));
    const boxExperiments = useSelector((state) => selectExperimentByBoxName(state, type));
    const subscriptions = useSelector(selectSubscriptions);
    const completionByExperimentId = useSelector(selectCompletionForAllExperiments);
    const cohort = useSelector(selectCohort);
    const scheduledExperimentsByStartTime = new Map<number, GenericExperiment[]>();
    const getExperimentsGroupedByCategory = () => {
        const experiments = boxExperiments.filter((item) => !('parent' in item) || !item.parent);
        const result = new Map();
        Object.keys(ExperimentCategory)
            .filter((key) => key !== ExperimentCategory.SUB_EXPERIMENT.valueOf())
            .forEach((key) => {
                result.set(key, []);
            });

        experiments.reduce((map, experiment) => {
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

    const isExperimentComplete = (experiment: GenericExperiment) => {
        if ('children' in experiment) {
            experiment.children.every((child) => completionByExperimentId[child] === 100);
        } else {
            return completionByExperimentId[experiment.id] === 100;
        }
    };

    const isExperimentAvailable = (experiment: GenericExperiment) => {
        return !experiment.hidden;
    };

    const isExperimentSuggested = (experiment: GenericExperiment) => {
        return experiment.isSuggested;
    };

    const getScheduledStartTime = (experiment: GenericExperiment) => {
        return cohort?.experimentSchedule.find((schedule) => schedule.experiments.includes(experiment.id))
            ?.startTimeUTC;
    };

    const iSubscribedToExperiment = (experiment: GenericExperiment) => {
        return (
            Object.keys(subscriptions).includes(experiment.id) ||
            ('children' in experiment &&
                experiment.children.every((child) => Object.keys(subscriptions).includes(child)))
        );
    };

    const experimentsGroupedByCategory = getExperimentsGroupedByCategory();

    const ionContentRef = React.useRef<HTMLIonContentElement>(null);
    const mainSectionRef = React.useRef<HTMLDivElement>(null);

    const handleClickScroll = function() {
        if (ionContentRef.current && mainSectionRef.current) {
            const offsetTop = mainSectionRef.current.offsetTop;
            ionContentRef.current.scrollToPoint(0, offsetTop, 500);
        }
    }

    const [showHeader, setShowHeader] = React.useState(false);
    const titlesRef = React.useRef<HTMLDivElement>(null);

    const handleScrollAnimation = function (e: CustomEvent<ScrollDetail>) {
        if (e.detail.scrollTop > SHOW_HEADER_SCROLL_THRESHOLD) {
            setShowHeader(true);
        }
        else {
            setShowHeader(false);
        }

        // Animate titles imperatively using DOM manipulations to avoid excessive React re-renders

        if (titlesRef.current) {
            const opacity = Math.max((SHOW_HEADER_SCROLL_THRESHOLD - e.detail.scrollTop) / SHOW_HEADER_SCROLL_THRESHOLD, 0);
            titlesRef.current.style.opacity = `${opacity}`;
        }
    }

    const history = useHistory();
    const handleGoBack = function () {
        history.goBack();
    }

    return (
        <IonPage>
            <Header 
                title={`${capitalise(type) }`} 
                style={{ 
                    position: thisBox.heroImageSrc ? 'fixed' : undefined, 
                    visibility: !thisBox.heroImageSrc || showHeader ? 'visible' : 'hidden', 
                    opacity: !thisBox.heroImageSrc || showHeader ? 1 : 0, 
                    transition: 'visibility 0.3s, opacity 0.3s ease-in-out' 
                }} 
            />
            <IonContent ref={ionContentRef} scrollEvents={!!thisBox.heroImageSrc} onIonScroll={handleScrollAnimation}>
                {thisBox.heroImageSrc && (
                    <Box
                        sx={{
                            height: 'calc(100dvh - 100px)',
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), var(--ion-background-color)), url(${thisBox.heroImageSrc})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            py: 4,
                            px: 2,
                        }}
                    >
                        <div ref={titlesRef}>
                            <HeaderButton onClick={handleGoBack}>Back</HeaderButton>
                            <PageTitle sx={{ mb: 0 }}>{capitalise(type)}</PageTitle>
                            {thisBox.description && <Typography level="h6">{thisBox.description}</Typography>}
                        </div>

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
                {thisBox.description && !thisBox.heroImageSrc && (
                    <React.Fragment>
                        <PageTitle sx={{ mb: 0 }}>{capitalise(type)}</PageTitle>
                        <Typography level="h6" sx={{ mb: 4 }}>
                            {thisBox.description}
                        </Typography>
                    </React.Fragment>
                )}

                <Container ref={mainSectionRef}>
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
