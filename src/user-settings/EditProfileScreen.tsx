import React from 'react';

import Page from '../shared/foundation/Page';

import ProfileForm from '../shared/components/ProfileForm';

const EditProfileScreen = function () {
    return (
        <Page headerTitle="Your profile">
            <ProfileForm />
        </Page>
    );
};

export default EditProfileScreen;
