import React from 'react';

import { Page, PageTitle } from '../common/ui/layout';
import ProfileForm from '../common/components/ProfileForm';

const CompleteProfileForm = function () {
    return (
        <Page>
            <PageTitle>Your profile</PageTitle>
            <ProfileForm info="We just need a bit of your personal information to get started" />
        </Page>
    );
};

export default CompleteProfileForm;
