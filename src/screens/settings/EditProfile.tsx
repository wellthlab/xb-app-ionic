import Strings from '../../utils/string_dict';
import React from 'react';

import Page from '../../components/foundation/Page';

import ProfileForm, { IProfileFormProps } from '../../components/ProfileForm';

import { useDispatch } from '../../slices/store';
import { updateUserProfile } from '../../slices/account';

const EditProfile = function () {
    const dispatch = useDispatch();
    const cohortIdRef = React.useRef(undefined)
    const handleSubmit: IProfileFormProps['onSubmit'] = async (data) => {
        await dispatch(updateUserProfile({ payload: data, cohortId: cohortIdRef.current })).unwrap();
    };

    return (
        <Page headerTitle={Strings.your_profile}>
            <ProfileForm onSubmit={handleSubmit} cohortIdRef ={cohortIdRef} isNewProfile={false} />
        </Page>
    );
};

export default EditProfile;
