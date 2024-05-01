import Strings from '../utils/string_dict.js';
import React from 'react';
import { Alert, Link } from '@mui/joy';

const ExerciseWarning = function () {
    return (
        <Alert color="warning">
            <div>
                {Strings.exercise_is_safe_and}
                {' '}
                <Link href="https://forms.office.com/r/gnYJRRAkRd" target="_blank">
                    {Strings.par_questionnaire}
                </Link>{' '}
                {Strings.exercise_is_safe_and_2}
            </div>
        </Alert>
    );
};

export default ExerciseWarning;
