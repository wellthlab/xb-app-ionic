import Strings from '../../utils/string_dict.js';
import React, { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Card, Grid, Box, Link, linkClasses, IconButton, styled, List, Stack } from '@mui/joy';

import capitalise from './utils/capitalise';

import getIcon from '../../utils/getIcon';
import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';
import { useSelector } from '../../slices/store';
import { selectAllBoxes } from '../../slices/experiments';
import { IonTabBar, IonTabButton } from '@ionic/react';
import { AppBar, Drawer, Toolbar } from '@mui/material';
import { ArrowDownward, ArrowUpward, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { CaretDown, CaretUp } from 'phosphor-react';


const BoxesSubMenu = function (props: any) {
    const boxes = useSelector(selectAllBoxes);
    const [open, setOpen] = React.useState(true);
    const toggleDrawerOpen = () => {
        console.log('called');
        setOpen(!open);
    };

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
        // padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        // ...theme.mixins.toolbar,
    }));

//
    // const handleDrawerClose = () => {
    //     setOpen(false);
    // };
    return (


        <Drawer variant="persistent" anchor="bottom" open={open}>
            <DrawerHeader style={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton onClick={toggleDrawerOpen}>
                    {open ? <CaretDown /> : <CaretUp />}
                </IconButton>
            </ DrawerHeader>

            <br />

            <Stack spacing={20} direction="row" style={{ display: 'flex', justifyContent: 'center' }}>
                {boxes.map((box) => {
                    const Icon = getIcon(box.icon);

                    return (
                        <div>
                            <div >
                                <Box
                                    component={Icon}
                                    color={box.disabled ? 'neutral.plainDisabledColor' : 'inherit'}
                                />
                                <Typography >
                                    {capitalise(box.name)}
                                </Typography>
                            </div>
                            {/*<Link*/}
                            {/*    overlay*/}
                            {/*    textColor="inherit"*/}
                            {/*    underline="none"*/}
                            {/*    component={RouterLink}*/}
                            {/*    to={`/main/box/${box.name}`}*/}
                            {/*    disabled={box.disabled}*/}
                            {/*    sx={{*/}
                            {/*        [`&.${linkClasses.disabled}`]: {*/}
                            {/*            color: 'neutral.plainDisabledColor',*/}
                            {/*        },*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*</Link>*/}
                        </div>

                    );
                })}
            </Stack>
            <br />

        </Drawer>


    );
};

export default BoxesSubMenu;
