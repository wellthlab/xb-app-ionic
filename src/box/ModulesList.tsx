import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Card, Stack, Typography, Box, Link } from '@mui/joy';

import { Page, PageTitle, SectionTitle } from '../common/ui/layout';
import { selectModulesByBox } from '../common/slices/modules';
import { useSelector } from '../common/store';
import { selectBox, selectStage } from '../common/slices/boxes';

const ModulesList = function () {
    const { type } = useParams<{ type: string }>();
    const modules = useSelector((state) => selectModulesByBox(state, type));
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

            <Stack spacing={1}>
                {modules.map((module) => (
                    <Card key={module.id} row>
                        <Box
                            component="img"
                            sx={{ width: 40, mr: 2 }}
                            src={`https://avatars.dicebear.com/api/identicon/${module.id}.svg`}
                            alt={`Thumbnail for module ${module.name}`}
                        />
                        <div>
                            <Typography level="h5">
                                <Link
                                    overlay
                                    textColor="inherit"
                                    component={RouterLink}
                                    to={`/main/box/${type}/${module.id}`}
                                >
                                    {module.name}
                                </Link>
                            </Typography>
                            <Typography level="body3">
                                {module.difficulty} - {module.playlists.length} playlists
                            </Typography>
                        </div>
                    </Card>
                ))}
            </Stack>
        </Page>
    );
};

export default ModulesList;
