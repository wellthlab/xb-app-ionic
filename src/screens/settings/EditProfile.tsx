import Strings from '../../utils/string_dict';
import React from 'react';

import Container from '../../components/foundation/Container';
import Page from '../../components/foundation/Page';

import ProfileForm, { IProfileFormProps } from '../../components/ProfileForm';

import { useDispatch } from '../../slices/store';
import { updateUserProfile } from '../../slices/account';

const EditProfile = function () {
    const dispatch = useDispatch();
    const cohortIdRef = React.useRef(undefined)
    const startOfWeekRef = React.useRef(undefined)

    const handleSubmit: IProfileFormProps['onSubmit'] = async (data) => {
        if (startOfWeekRef.current) {
            data['startOfWeek'] = startOfWeekRef.current;
        }
        await dispatch(updateUserProfile({ payload: data, cohortId: cohortIdRef.current })).unwrap();
    };

    return (
        <Page headerTitle={Strings.your_profile} sx={{
            backgroundColor: 'var(--joy-palette-neutral-50)'
        }} >
            <Container
                maxWidth="sm"
                sx={{
                    backgroundColor: "#fff",
                    height: 'auto',      // Prevent full height
                    minHeight: 'unset',
                    borderRadius: "10px",
                    boxShadow: "2px 4px 5px rgba(0,0,0,.3)",
                    py: 3
            }}>
                <ProfileForm onSubmit={handleSubmit} cohortIdRef={cohortIdRef} startOfWeekRef={startOfWeekRef} isNewProfile={false} />
            </Container>

        </Page>
    );
};

export default EditProfile;
