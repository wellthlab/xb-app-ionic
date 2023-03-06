import React from 'react';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';

import ProfileForm from '../../components/ProfileForm';

const NewProfile = function () {
    return (
        <Page>
            <PageTitle>Your profile</PageTitle>
            <ProfileForm />
        </Page>
    );
};

export default NewProfile;
