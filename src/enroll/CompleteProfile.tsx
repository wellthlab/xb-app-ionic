import React from 'react';

import { Page, PageTitle } from '../common/ui/layout';
import ProfileForm from '../components/ProfileForm';

const CompleteProfile = function () {
    return (
        <Page>
            <PageTitle>Your profile</PageTitle>
            <ProfileForm />
        </Page>
    );
};

export default CompleteProfile;
