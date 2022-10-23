import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Card, Typography, Box, Link } from '@mui/joy';

import { subscribeToModule } from '../../common/slices/account';
import { useSelector, useDispatch } from '../../common/store';
import { selectModuleById } from '../../common/slices/modules';

interface IModulesListItemProps {
    id: string;
}

const ModulesListItem = function ({ id }: IModulesListItemProps) {
    const { type } = useParams<{ type: string }>();

    const module = useSelector((state) => selectModuleById(state, id))!;

    const dispatch = useDispatch();
    const handleClick = function () {
        dispatch(subscribeToModule(id));
    };

    return (
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
                        onClick={handleClick}
                    >
                        {module.name}
                    </Link>
                </Typography>
                <Typography level="body3">
                    {module.difficulty} - {module.playlists.length} playlists
                </Typography>
            </div>
        </Card>
    );
};

export default ModulesListItem;
