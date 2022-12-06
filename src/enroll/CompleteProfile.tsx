import React from 'react';

import Page from '../foundation/Page';
import PageTitle from '../foundation/PageTitle';
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
