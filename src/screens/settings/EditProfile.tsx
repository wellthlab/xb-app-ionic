import React from 'react';

import Page from '../../components/foundation/Page';

import ProfileForm from '../../components/ProfileForm';

const EditProfile = function () {
    return (
        <Page headerTitle="Your profile">
            <ProfileForm />
        </Page>
    );
};

export default EditProfile;
