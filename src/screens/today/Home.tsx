import React from 'react';
import { Button, Link, Stack } from '@mui/joy';
import { Link as RouterLink } from 'react-router-dom';


import Centre from '../../components/foundation/Centre';
import Page from '../../components/foundation/Page';

import { useSelector } from '../../slices/store';
import { selectTodaysTasks } from '../../slices/experiments';
import Header from '../../components/foundation/Header';
import PageTitle from '../../components/foundation/PageTitle';
import { selectFullName } from '../../slices/account';

const Home = function () {

    const name = useSelector(selectFullName);

    const handleAddJourney = function () {

    }

    return (
        <Page>
            <Centre>
                <Stack spacing={1}>
                <PageTitle sx={{ mb: 2 }}>Hi {name}, what would you like to do next?</PageTitle>
                    <Link
                        overlay
                        underline="none"
                        component={RouterLink}
                        to={`/main/newJourney`}
                    >
                        Add new Journey
                    </Link>
                </Stack>
            </Centre>
        </Page>
    );
};

export default Home;
