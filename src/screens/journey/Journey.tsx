import React, { Suspense, lazy, useState } from "react";
import LineEditor from "./LineEditor";
import Header from "../../components/foundation/Header";
import { ButtonGroup } from "@mui/material";
import Button from "@mui/joy/Button";
import Page from "../../components/foundation/Page";
import Centre from "../../components/foundation/Centre";
import { LatLngLiteral } from "leaflet";
import StickerEditor from "./StickerEditor";
import { CircularProgress } from "@mui/joy";
import LineSegment from "./Elements/LineSegment";
const Map = lazy(() => import("./Map"))

function Journey() {

    const [lines, setLines] = useState<[L.LatLngLiteral, L.LatLngLiteral][]>([])
    const [state, setStart] = useState<StickersProps>()
    const [end, setEnd] = useState<StickersProps>()
    const [mode, setMode] = useState<Mode>(Mode.ROUTE)

    const handleSave = function () {
        console.log("Saving data...")
    }

    const handleNext = function () {
        console.log("Going to the next stage...")
        setMode(Mode.STARTPOINT)
    }

    function DisplayEditor(mode: Mode) {
        switch (mode) {
            case Mode.ROUTE:
                return (<LineEditor lines={lines} setLines={setLines}/>)
            case Mode.STARTPOINT:
                return (<>
                    <StickerEditor />
                    {lines?.map(([i, j]) =>
            <LineSegment start={i} end={j} colour={"lime"} key={i.lat} />)
        }
                </>)
        }
    }
    return (<Page>
        <Centre>
            <Header title={mode.getTitle()} />
            <Suspense fallback={<CircularProgress />}>
                <Map>
                    {DisplayEditor(mode)}
                </Map>
            </Suspense>
            <ButtonGroup>
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={handleNext}>Next</Button>
            </ButtonGroup>
        </Centre>
    </Page>)
}

type StickersProps = {
    point: LatLngLiteral,
    index: number,
    uuid: string
}

class Mode {
    public static ROUTE = new Mode("Draw the route for today's journey")
    public static STARTPOINT = new Mode("Place a sticker onto your start point")

    private title: string;

    private constructor(title: string) {
        this.title = title;
    }

    public getTitle() {
        return this.title
    }
}

export default Journey;