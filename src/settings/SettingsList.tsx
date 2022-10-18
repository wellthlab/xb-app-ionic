import React from 'react';
import { Stack, Typography, useColorScheme } from '@mui/joy';
import { IconContext, Info, CaretRight, Moon, User, SignOut, TrashSimple } from 'phosphor-react';

import { List, ListItem } from '../ui/list';
import { Page, PageTitle } from '../ui/layout';
import { Select } from '../ui/form';
import { selectDepartment, selectFullName, logOutUser } from '../slices/account';
import { useSelector, useDispatch } from '../store';

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
        dispatch(logOutUser());
    };

    return (
        <Page>
            <PageTitle>Settings</PageTitle>

            <IconContext.Provider value={{ size: 20 }}>
                <Stack spacing={2}>
                    <List>
                        <ListItem href="/settings/profile" startDecorator={<User />} endDecorator={<CaretRight />}>
                            {fullName}
                            <Typography level="body3" noWrap>
                                {department}
                            </Typography>
                        </ListItem>
                    </List>

                    <List>
                        <ListItem href="/settings/about" startDecorator={<Info />} endDecorator={<CaretRight />}>
                            About
                        </ListItem>
                        <ListItem
                            startDecorator={<Moon />}
                            endDecorator={
                                <Select
                                    value={mode || ''}
                                    options={['system', 'light', 'dark']}
                                    onChange={handleChangeMode}
                                />
                            }
                        >
                            Dark mode
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
