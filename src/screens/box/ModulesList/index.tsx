import React from 'react';
import { useParams } from 'react-router-dom';
import { Stack } from '@mui/joy';

import ModulesListItem from './ModulesListItem';

import Page from '../../../components/foundation/Page';
import SectionTitle from '../../../components/foundation/SectionTitle';

import { selectModulesByBox } from '../../../slices/modules';
import { useSelector } from '../../../slices/store';

const renderModulesList = function (name: string, items: string[]) {
    if (!items.length) {
        return;
    }

    return (
        <React.Fragment>
            <SectionTitle>{name}</SectionTitle>

            <Stack spacing={1}>
                {items.map((moduleId) => (
                    <ModulesListItem id={moduleId} key={moduleId} />
                ))}
            </Stack>
        </React.Fragment>
    );
};

const ModulesList = function () {
    const { type } = useParams<{ type: string }>();
    const modules = useSelector((state) => selectModulesByBox(state, type))!;

    return (
        <Page headerTitle={type.toUpperCase()}>
            {!modules ? (
                'Sorry, there is no available module for this box'
            ) : (
                <React.Fragment>
                    {renderModulesList('Subscribed modules', modules[0])}
                    {renderModulesList('Discover modules', modules[1])}
                </React.Fragment>
            )}
        </Page>
    );
};

export default ModulesList;
