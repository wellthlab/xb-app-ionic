import React from 'react';
import { useIonAlert } from '@ionic/react';
import { Stack, Typography, Alert, useColorScheme, Box } from '@mui/joy';
import { IconContext, Info, Palette, User, SignOut, TrashSimple } from 'phosphor-react';

import List from '../../components/foundation/List';
import ListItem from '../../components/foundation/ListItem';
import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';
import Select from '../../components/foundation/Select';

import { logOut } from '../../slices/globalActions';
import { selectUserId, markAccountAsDeleted, selectIsDeleted } from '../../slices/account';
import { useSelector, useDispatch } from '../../slices/store';

const AllSettings = function () {
    const userId = useSelector(selectUserId);
    const isDeleted = useSelector(selectIsDeleted);

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

    const [presentAlert] = useIonAlert();

    const handleClickDelete = function () {
        presentAlert({
            header: 'Are you sure?',
            subHeader: 'This action is irreversible',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'OK',
                    role: 'confirm',
                    handler: handleDeleteAccount,
                },
            ],
        });
    };

    const [deleteFailed, setDeleteFailed] = React.useState(false);
    const handleDeleteAccount = async function () {
        try {
            await dispatch(markAccountAsDeleted());
        } catch (error) {
            console.log(error);
            setDeleteFailed(true);
        }
    };

    return (
        <Page>
            <PageTitle>Settings</PageTitle>

            <IconContext.Provider value={{ size: 20 }}>
                <Stack spacing={2}>
                    <List>
                        <ListItem startDecorator={<User />}>
                            <Typography level="body3" noWrap>
                                Participant ID
                            </Typography>
                            {userId}
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

                    {isDeleted && (
                        <Alert color="warning">
                            You have requested your account to be deleted. We will be in touch soon.
                        </Alert>
                    )}

                    {deleteFailed && <Alert color="danger">Sorry, your account cannot be deleted at the moment</Alert>}

                    <List>
                        <ListItem
                            button
                            buttonProps={{ disabled: isDeleted, color: isDeleted ? undefined : 'danger' }}
                            startDecorator={<Box component={TrashSimple} color="danger.plainColor" />}
                            onClick={handleClickDelete}
                        >
                            Delete your account
                        </ListItem>
                    </List>
                </Stack>
            </IconContext.Provider>
        </Page>
    );
};

export default AllSettings;
