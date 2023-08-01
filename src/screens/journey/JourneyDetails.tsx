import React, { useState } from 'react';
import { Button, Stack } from '@mui/joy';
import Centre from '../../components/foundation/Centre';
import Page from '../../components/foundation/Page';
import Header from '../../components/foundation/Header';
import TextAreaForm from '../../components/foundation/TextAreaForm';

const JourneyDetails = function () {

    const [purposeText, setPurposeText] = useState<string>("")
    const [weatherText, setWeatherText] = useState<string>("")
    const [durationText, setDurationText] = useState<string>("")

    const handleNext = function () {
        console.log("Going to the next stage...")
    }

    const handleSave = function () {
        console.log("Saving data...")
    }

    return (
        <Page>
            <Centre>
                <Header title={"Fill in the blanks"} />
                <Stack spacing={2}>
                    <TextAreaForm label='What was the purpose of your journey?' text={purposeText} setText={setPurposeText} />
                    <TextAreaForm label='What was the weather like during your journey?' text={weatherText} setText={setWeatherText} />
                    <TextAreaForm label='How long did your journey take' text={durationText} setText={setDurationText} />
                    <Stack direction="row" spacing={1}>
                        <Button onClick={handleSave} fullWidth>Save</Button>
                        <Button onClick={handleNext} fullWidth>Next</Button>
                    </Stack>
                </Stack>
            </Centre>
        </Page>
    );
};

export default JourneyDetails;
