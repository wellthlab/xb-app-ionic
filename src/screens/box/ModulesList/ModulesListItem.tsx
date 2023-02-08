import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Card, Typography, Box, Link, Stack, Avatar } from '@mui/joy';

import { subscribeToModule } from '../../../slices/account';
import { useSelector, useDispatch } from '../../../slices/store';
import { selectModuleById, selectModuleSubcriberInitials } from '../../../slices/modules';

interface IModulesListItemProps {
    id: string;
}

const ModulesListItem = function ({ id }: IModulesListItemProps) {
    const { type } = useParams<{ type: string }>();

    const module = useSelector((state) => selectModuleById(state, id))!;
    const initials = useSelector((state) => selectModuleSubcriberInitials(state, id))!;

    const dispatch = useDispatch();
    const handleClick = function () {
        dispatch(subscribeToModule(id));
    };

    return (
        <Card
            row
            sx={{
                '&:hover, &:focus-within': {
                    bgcolor: 'background.level2',
                },
            }}
        >
            <Box
                component="img"
                sx={{ width: 48, mr: 2 }}
                src={`https://avatars.dicebear.com/api/identicon/${module.id}.svg`}
                alt={`Thumbnail for module ${module.name}`}
            />
            <Stack spacing={0.5}>
                <Typography level="h5">
                    <Link
                        overlay
                        textColor="inherit"
                        underline="none"
                        component={RouterLink}
                        to={`/main/box/${type}/${module.id}`}
                        onClick={handleClick}
                    >
                        {module.name}
                    </Link>
                </Typography>
                <Typography level="body3">{module.playlists.length} playlists</Typography>

                {initials && initials.length ? (
                    <Stack direction="row" spacing={1}>
                        {initials.map(({ id, initial }) => (
                            <Avatar key={id} size="sm">
                                {initial}
                            </Avatar>
                        ))}
                    </Stack>
                ) : null}
            </Stack>
        </Card>
    );
};

export default ModulesListItem;
