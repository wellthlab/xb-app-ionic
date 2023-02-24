import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarPicker } from '@mui/x-date-pickers';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';

const Journal = function () {
    const [currentDate, setCurrentDate] = React.useState<Dayjs | null>(dayjs());

    return (
        <Page>
            <PageTitle>Journal</PageTitle>
            <CalendarPicker date={currentDate} onChange={setCurrentDate} />
        </Page>
    );
};

export default Journal;
