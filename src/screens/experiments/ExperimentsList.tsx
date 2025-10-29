import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Stack, Typography, Box, AspectRatio } from '@mui/joy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import capitalise from './utils/capitalise';
import ExperimentsList from './components/ExperimentsList';
import ExerciseWarning from '../../components/ExerciseWarning';

import { useSelector } from '../../slices/store';
import { selectBoxByType, selectExperimentByBoxName } from '../../slices/experiments';
import BoxesSubMenu from './BoxesSubMenu';
import { IonContent, IonFooter, IonPage, IonToolbar } from '@ionic/react';
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

const ExperimentsListScreen = function () {
    const { type } = useParams<{ type: string }>();

    const thisBox = useSelector((state) => selectBoxByType(state, type));
    const boxExperiments = useSelector((state) => selectExperimentByBoxName(state, type));
    const [drawerContent, setDrawerContent] = React.useState<any | null>(null);

    const ionContentRef = React.useRef<HTMLIonContentElement>(null);

    const history = useHistory();

    // TODO: Color has been removed as an option from Vite so reverting to a Switch statement. This variable should be stored on Vite because this is currently very brittle.

    let pageBackgroundColor = '';

    switch (thisBox.name) {
        case 'Move':
            pageBackgroundColor = 'var(--box-background-move)';
            break;
        case 'Eat':
            pageBackgroundColor = 'var(--box-background-eat)';
            break;
        case 'Sleep':
            pageBackgroundColor = 'var(--box-background-sleep)';
            break;
        case 'Base Box':
            pageBackgroundColor = 'var(--box-background-base)';
            break;
        case 'Journal':
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
                            <Typography level="h1">Introduction to the {thisBox.name} Box</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ backgroundColor: 'transparent', width: '100%' }}>
                            {thisBox.overview}
                        </AccordionDetails>
                    </Accordion>
                </Box>

                <ExperimentsList key={type} experiments={boxExperiments} />

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
