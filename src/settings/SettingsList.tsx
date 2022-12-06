import React from 'react';
import { Stack, Typography, useColorScheme } from '@mui/joy';
import { IconContext, Info, Palette, User, SignOut, TrashSimple } from 'phosphor-react';

import List from '../foundation/List';
import ListItem from '../foundation/ListItem';
import Page from '../foundation/Page';
import PageTitle from '../foundation/PageTitle';
import Select from '../foundation/Select';
import { logOut } from '../slices/globalActions';
import { selectDepartment, selectFullName } from '../slices/account';
import { useSelector, useDispatch } from '../slices/store';

const SettingsList = function () {
    const fullName = useSelector(selectFullName);
    const department = useSelector(selectDepartment);

    // Set dark mode option

    const { mode, setMode } = useColorScheme();
    const handleChangeMode = function (e: React.ChangeEvent<HTMLSelectElement>) {
        setMode(e.target.value as any);
    };

    // Log out

    const dispatch = useDispatch();
    const handleLogOut = function () {
        dispatch(logOut());
    };

    return (
        <Page>
            <PageTitle>Settings</PageTitle>

            <IconContext.Provider value={{ size: 20 }}>
                <Stack spacing={2}>
                    <List>
                        <ListItem href="/main/settings/profile" startDecorator={<User />}>
                            {fullName}
                            <Typography level="body3" noWrap>
                                {department}
                            </Typography>
                        </ListItem>
                    </List>

                    <List>
                        <ListItem href="/main/settings/about" startDecorator={<Info />}>
                            About
                        </ListItem>
                        <ListItem
                            startDecorator={<Palette />}
                            endDecorator={
                                <Select
                                    value={mode || ''}
                                    options={['system', 'light', 'dark']}
                                    onChange={handleChangeMode}
                                />
                            }
                        >
                            App theme
                        </ListItem>
                        <ListItem button startDecorator={<SignOut />} onClick={handleLogOut}>
                            Log out
                        </ListItem>
                    </List>

                    <List>
                        <ListItem button startDecorator={<TrashSimple />}>
                            Delete your account
                            <Typography level="body3" noWrap>
                                This action is irreversible. Please be certain.
                            </Typography>
                        </ListItem>
                    </List>
                </Stack>
            </IconContext.Provider>
        </Page>
    );
};

export default SettingsList;
