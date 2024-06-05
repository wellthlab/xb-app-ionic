import Strings from '../../utils/string_dict';
import React from 'react';

import Page from '../../components/foundation/Page';

import ProfileForm, { IProfileFormProps } from '../../components/ProfileForm';

import { useSelector, useDispatch } from '../../slices/store';
import { selectCohortId, updateUserProfile } from '../../slices/account';

const EditProfile = function () {
    const cohortId = useSelector(selectCohortId);
    const dispatch = useDispatch();

    const handleSubmit: IProfileFormProps['onSubmit'] = async (data) => {
        await dispatch(updateUserProfile({ payload: data, cohortId })).unwrap();
    };

    return (
        <Page headerTitle={Strings.your_profile}>
            <ProfileForm onSubmit={handleSubmit} />
        </Page>
    );
};

export default EditProfile;
