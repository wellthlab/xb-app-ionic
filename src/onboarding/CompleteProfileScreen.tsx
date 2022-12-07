import React from 'react';

import Page from '../shared/foundation/Page';
import PageTitle from '../shared/foundation/PageTitle';

import ProfileForm from '../shared/components/ProfileForm';

const CompleteProfileScreen = function () {
    return (
        <Page>
            <PageTitle>Your profile</PageTitle>
            <ProfileForm />
        </Page>
    );
};

export default CompleteProfileScreen;
