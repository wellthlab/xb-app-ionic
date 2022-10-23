import React from 'react';

import { Page } from '../common/ui/layout';
import ProfileForm from '../common/components/ProfileForm';

const EditProfileForm = function () {
    return (
        <Page headerTitle="Your profile">
            <ProfileForm />
        </Page>
    );
};

export default EditProfileForm;
