import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Link, linkClasses } from '@mui/joy';

import capitalise from './utils/capitalise';
import getIcon from '../../utils/getIcon';
import { useSelector } from '../../slices/store';
import { selectAllBoxes } from '../../slices/experiments';
import {IonLabel, IonTabBar, IonTabButton} from '@ionic/react';
import { Drawer } from '@mui/material';

const BoxesSubMenu = function () {
    const boxes = useSelector(selectAllBoxes);
    const { type } = useParams<{ type: string }>();

    return (
            <Drawer variant="persistent" anchor="bottom" open={true}>
                <IonTabBar slot="bottom">
                    {boxes.map((box) => {
                        const Icon = getIcon(box.icon);
                        const path = "/main/box/" + box.name;
                        return (
                            <IonTabButton selected={box.name===type}>
                                <Box
                                    component={Icon}
                                    color={box.disabled ? 'neutral.plainDisabledColor' : 'inherit'}
                                />
                                <IonLabel>{capitalise(box.name)}</IonLabel>
                                 <Link
                                        overlay
                                        textColor="inherit"
                                        underline="none"
                                        component={RouterLink}
                                        to={path}
                                        disabled={box.disabled}
                                        sx={{
                                            [`&.${linkClasses.disabled}`]: {
                                                color: 'neutral.plainDisabledColor',
                                            },
                                        }}
                                    >
                                    </Link>
                            </IonTabButton>
                        );
                    })}
                </IonTabBar>
            </Drawer>
    );
};

export default BoxesSubMenu;
