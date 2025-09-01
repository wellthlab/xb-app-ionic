import Strings from '../../utils/string_dict';
import React from 'react';

import Page from '../../components/foundation/Page';

import AboutThisStudy from '../../components/AboutThisStudy';

const StudyInformation = function () {
    return (
        <Page headerTitle={Strings.about_this_study}>
            <AboutThisStudy />
        </Page>
    );
};

export default StudyInformation;
