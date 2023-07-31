import React, { Suspense, lazy, useState } from "react";
import LineEditor from "./LineEditor";
import Header from "../../components/foundation/Header";
import { ButtonGroup } from "@mui/material";
import Button from "@mui/joy/Button";
import Page from "../../components/foundation/Page";
import Centre from "../../components/foundation/Centre";
const Map = lazy(() => import("./Map"))

function Journey() {

    const handleSave = function () {
        console.log("Saving data...")
    }

    const handleNext = function () {
        console.log("Going to the next stage...")
    }
    return (<Page>
        <Centre>
            <Header title="Draw the route for today's journey" />
            <Suspense fallback={<div>Loading...</div>}>
                <Map children={<LineEditor />} />
            </Suspense>
            <ButtonGroup>
                <Button>Save</Button>
                <Button>Next</Button>
            </ButtonGroup>
        </Centre>
    </Page>)
}

export default Journey;