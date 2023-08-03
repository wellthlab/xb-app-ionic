import React, { useState } from 'react';
import { Button, Stack, Checkbox } from '@mui/joy';
import Centre from '../../components/foundation/Centre';
import Page from '../../components/foundation/Page';
import Header from '../../components/foundation/Header';
import { FormControlLabel, FormGroup } from '@mui/material';

const JourneyTransport = function () {

    const [transports, setTransports] = useState<Map<string, boolean>>();
    Object.values(Transport).map((t) => transports?.set(t,false))

    const handleCheckBoxChange = function(t: string, e: React.ChangeEvent<HTMLInputElement>) {
        console.log("Chaning value")
    }
    const handleNext = function () {
        console.log("Going to the next stage...")
    }

    const handleSave = function () {
        console.log("Saving data...")
    }

    //May add a time picker component to allow for the data to be more consistent
    return (
        <Page>
            <Centre>
                <Header title={"Tick the boxes next to the transport mode(s) you used in your journey."} />
                <Stack spacing={2}>
                    <FormGroup>
                    {Object.values(Transport).map((t) => <FormControlLabel label={t} control={<Checkbox checked={transports?.get(t)} onChange={(e) => handleCheckBoxChange(t,e)}/>}/>)}
                    </FormGroup>
                    <Stack direction="row" spacing={1}>
                        <Button onClick={handleSave} fullWidth>Save</Button>
                        <Button onClick={handleNext} fullWidth>Next</Button>
                    </Stack>
                </Stack>
            </Centre>
        </Page>
    );
};

enum Transport {
    Walking = "Walking",
    CYCLING = "Cycling",
    SCOOTER = "Scooter",
    BUS = "Bus",
    TRAIN = "Train",
    TUBE = "Tube",
    CAR = "Car"

}

export default JourneyTransport;
