import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Link, linkClasses } from '@mui/joy';

import capitalise from './utils/capitalise';
import getIcon from '../../utils/getIcon';
import { useSelector } from '../../slices/store';
import { selectAllBoxes } from '../../slices/experiments';
import { IonLabel, IonTabBar, IonTabButton } from '@ionic/react';
import { Drawer } from '@mui/material';

const BoxesSubMenu = function () {
    const boxes = useSelector(selectAllBoxes);
    const { type } = useParams<{ type: string }>();

    return (
        <Drawer variant="persistent" anchor="bottom" open={true}>
            <IonTabBar slot="bottom" className="xb-tab-menu--sub-menu">
                {boxes.map((box) => {
                    const Icon = getIcon(box.icon);
                    const path = "/main/box/" + box.name;
                    const isSelected = box.name === type;

                    return (
                        <IonTabButton
                            key={box.name}
                            tab={box.name}
                            href={path}
                            disabled={box.disabled}
                            className={`xb-tab-button ${isSelected ? 'tab-selected' : ''}`}
                        >
                            <Box
                                component={Icon}
                                color={box.disabled ? 'neutral.plainDisabledColor' : 'inherit'}
                            />
                            <IonLabel>{capitalise(box.name)}</IonLabel>
                        </IonTabButton>
                    );
                })}
            </IonTabBar>
        </Drawer>
    );
};

export default BoxesSubMenu;
