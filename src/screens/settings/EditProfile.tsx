import Strings from '../../utils/string_dict.js';
import React from 'react';

import Page from '../../components/foundation/Page';

import ProfileForm from '../../components/ProfileForm';

const EditProfile = function () {
    return (
        <Page headerTitle={Strings.your_profile}>
            <ProfileForm />
        </Page>
    );
};

export default EditProfile;
