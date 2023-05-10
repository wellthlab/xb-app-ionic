import React from 'react';
import { Alert, Link } from '@mui/joy';

const ExerciseWarning = function () {
    return (
        <Alert color="warning">
            <div>
                Exercise is safe and beneficial for most people, but some people should check with their doctor before
                changing their physical activity patterns. Use the{' '}
                <Link href="https://forms.office.com/r/gnYJRRAkRd" target="_blank">
                    PAR Questionnaire
                </Link>{' '}
                and/or consult your GP before engaging in physical activity.
            </div>
        </Alert>
    );
};

export default ExerciseWarning;
