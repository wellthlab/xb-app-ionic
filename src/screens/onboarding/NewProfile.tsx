import React from 'react';
import { useHistory } from 'react-router-dom';

import Page from '../../components/foundation/Page';
import PageTitle from '../../components/foundation/PageTitle';

import ProfileForm, { IProfileFormProps } from '../../components/ProfileForm';
import { useDispatch } from '../../slices/store';
import { setCohortId, setProfile } from '../../slices/onboarding';

import Strings from '../../utils/string_dict';
import { DayOfWeek } from '../../models/Account';

const NewProfile = function () {
    const dispatch = useDispatch();
    const cohortIdRef = React.useRef(undefined)

    const history = useHistory();
    const handleSubmit: IProfileFormProps['onSubmit'] = function (data) {
        if (!data['startOfWeek']) {
            data['startOfWeek'] = DayOfWeek.MONDAY;
        }
        dispatch(setProfile(data));
        dispatch(setCohortId(cohortIdRef.current));
        history.push('/onboarding/welcome/0');
    };

    return (
        <Page>
            <PageTitle>{Strings.your_profile}</PageTitle>
            <ProfileForm onSubmit={handleSubmit} cohortIdRef ={cohortIdRef}  />
        </Page>
    );
};

export default NewProfile;
