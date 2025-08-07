import Strings from '../../utils/string_dict';
import React from 'react';
import { useIonAlert } from '@ionic/react';
import { Stack, Alert, useColorScheme, Box, Container, Typography } from '@mui/joy';
import { IconContext, Info, Palette, User, SignOut, TrashSimple } from 'phosphor-react';

import List from '../../components/foundation/List';
import ListItem from '../../components/foundation/ListItem';
import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';
import Select from '../../components/foundation/Select';

import { logOut } from '../../slices/globalActions';
import { markAccountAsDeleted, selectIsDeleted } from '../../slices/account';
import { useSelector, useDispatch } from '../../slices/store';

import BuildInfo from '../../components/BuildInfo';

const AllSettings = function () {
    const isDeleted = useSelector(selectIsDeleted);

    // Set dark mode option

    const { mode, setMode } = useColorScheme();
    const handleChangeMode = function (e: React.ChangeEvent<HTMLSelectElement>) {
        //setMode(e.target.value as any);
        setMode("light");
    };

    // Log out

    const dispatch = useDispatch();
    const handleLogOut = function () {
        dispatch(logOut());
    };

    const [presentAlert] = useIonAlert();

    const handleClickDelete = function () {
        presentAlert({
            header: Strings.are_you_sure,
            subHeader: Strings.this_action_is_irreversible,
            buttons: [
                {
                    text: Strings.cancel,
                    role: 'cancel',
                },
                {
                    text: Strings.ok,
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
        <Page
            disableGutters
            sx={{
                position: 'relative',
                m: 0,
                maxWidth: '100% !important',
                width: '100%',
                justifyContent: "top",
                alignItems: 'top',
                backgroundImage: `url(/assets/backgrounds/settings_tile.svg), linear-gradient(to top right, #6e6b80, #6b7280);`,
                backgroundRepeat: 'repeat, no-repeat',
                backgroundSize: '200px, cover',
                backgroundPosition: 'top right, center',
                animation: 'scrollBg 15s linear infinite',
                '@keyframes scrollBg': {
                    '0%': {
                        backgroundPosition: '0 0, center',
                    },
                    '100%': {
                        backgroundPosition: '200px 110px, center',
                    },
                },
            }}
        >
            <Container
                maxWidth="sm"
                sx={{
                    backgroundColor: "#fff",
                    height: 'auto',      // Prevent full height
                    minHeight: 'unset',
                    borderRadius: "10px",
                    boxShadow: "2px 4px 5px rgba(0,0,0,.3)",
                    py: 3
                }}
            >
                <PageTitle sx={{ mb: 0 }}>{Strings.settings}</PageTitle>
                <Typography level="body2" sx={{ mb: 2 }}>
                    {Strings.adjust_how_app_works}
                </Typography>

                <IconContext.Provider value={{ size: 20 }}>
                    <Stack spacing={2}>
                        <List>
                            <ListItem href="/main/settings/profile" startDecorator={<User />}>
                                Your profile
                            </ListItem>
                        </List>

                        <List>
                            <ListItem href="/main/settings/about" startDecorator={<Info />}>
                                {Strings.about}
                            </ListItem>
                            {/*
                            TODO: Dark mode does not currently meet accessible contrast ratio so
                            hardcoded to 'light' setting for now
                            
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
                                {Strings.app_theme}
                            </ListItem>
                            */}
                            <ListItem button startDecorator={<SignOut />} onClick={handleLogOut}>
                                {Strings.log_out}
                            </ListItem>
                        </List>

                        {isDeleted && <Alert color="warning">{Strings.you_have_requested_your}</Alert>}

                        {deleteFailed && <Alert color="danger">{Strings.sorry_your_account_cannot_be}</Alert>}

                        <List>
                            <ListItem
                                button
                                buttonProps={{ disabled: isDeleted, color: isDeleted ? undefined : 'danger' }}
                                startDecorator={<Box component={TrashSimple} color="danger.plainColor" />}
                                onClick={handleClickDelete}
                            >
                                {Strings.delete_your_account}
                            </ListItem>
                        </List>
                    </Stack>

                    <BuildInfo />
                </IconContext.Provider>
            </Container>
        </Page>
    );
};

export default AllSettings;
