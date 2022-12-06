import React from 'react';

import Page from '../foundation/Page';
import ProfileForm from '../components/ProfileForm';

const EditProfileForm = function () {
    return (
        <Page headerTitle="Your profile">
            <ProfileForm />
        </Page>
    );
};

export default EditProfileForm;
