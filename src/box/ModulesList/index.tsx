import React from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Typography, Box } from '@mui/joy';

import ModulesListItem from './ModulesListItem';
import { Page, PageTitle, SectionTitle } from '../../common/ui/layout';
import { selectModulesByBox } from '../../slices/modules';
import { selectBox, selectStage } from '../../slices/boxes';
import { useSelector } from '../../slices/store';

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
    const [subscribedModules, remainingModules] = useSelector((state) => selectModulesByBox(state, type))!;
    const box = useSelector((state) => selectBox(state, type));
    const stage = useSelector((state) => selectStage(state, type));

    if (!box) {
        return (
            <Page>
                <Typography>Box not yet implemented</Typography>
            </Page>
        );
    }

    return (
        <Page>
            <PageTitle>{box.title}</PageTitle>

            {stage && (
                <Box sx={{ mb: 4 }}>
                    <SectionTitle>{stage.title}</SectionTitle>
                    <Typography level="body2">{stage.desc}</Typography>
                </Box>
            )}

            {renderModulesList('Subscribed modules', subscribedModules)}
            {renderModulesList('Discover modules', remainingModules)}
        </Page>
    );
};

export default ModulesList;
