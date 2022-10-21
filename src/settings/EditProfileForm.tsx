import React from 'react';

import { Page } from '../common/ui/layout';
import ProfileForm from '../common/components/ProfileForm';
import { selectProfile } from '../common/slices/account';
import { useSelector } from '../common/store';

const EditProfileForm = function () {
    const { id, ...profile } = useSelector(selectProfile)!;

    return (
        <Page headerTitle="Your profile">
            <ProfileForm defaultValues={profile} />
        </Page>
    );
};

export default EditProfileForm;
