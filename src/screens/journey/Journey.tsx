import React, { Suspense, lazy, useState } from "react";
import LineEditor from "../../components/TaskModal/Map/LineEditor";
import Header from "../../components/foundation/Header";
import { ButtonGroup } from "@mui/material";
import Button from "@mui/joy/Button";
import Page from "../../components/foundation/Page";
import Centre from "../../components/foundation/Centre";
import { DragEndEvent, LatLngLiteral } from "leaflet";
import StickerEditor from "../../components/TaskModal/Map/StickerEditor";
import { CircularProgress, Stack } from "@mui/joy";
import LineSegment from "../../components/TaskModal/Map/LineSegment";
import Sticker from "../../components/TaskModal/Map/sticker";
import StickerDrawer from "../../components/TaskModal/Map/StickerDrawer";
import StickerMarker from "../../components/TaskModal/Map/StickerMarker";
import { useHistory } from "react-router-dom";
const Map = lazy(() => import("../../components/TaskModal/Map/Map"))

function Journey() {

    const [lines, setLines] = useState<[L.LatLngLiteral, L.LatLngLiteral][]>([])
    const [mode, setMode] = useState<Mode>(Mode.ROUTE)
    const [activeSticker, setActiveSticker] = useState<number>(0)
    const [start, setStart] = useState<[StickersProps][]>([])
    const [end, setEnd] = useState<[StickersProps][]>([])
    const navigate = useHistory();

    const handleSave = function () {
        console.log("Saving data...")
    }

    const handleNext = function () {
        switch (mode) {
            case Mode.ROUTE:
                setMode(Mode.STARTPOINT)
                break
            case Mode.STARTPOINT:
                setMode(Mode.ENDPOINT)
                break
            case Mode.ENDPOINT:
                navigate.push("/main/newJourney/JourneyDetails")
        }
    }

    function DisplayEditor(mode: Mode) {
        switch (mode) {
            case Mode.ROUTE:
                return (<LineEditor lines={lines} setLines={setLines} />)
            case Mode.STARTPOINT:
                return (<>
                    <StickerEditor stickerSet={mode.getListStickers()} stickers={start} setStickers={setStart} activeSticker={activeSticker} />
                    {lines?.map(([i, j]) =>
                        <LineSegment start={i} end={j} colour={"lime"} key={i.lat} />)
                    }
                </>)
            case Mode.ENDPOINT:
                return (<>
                    <StickerEditor stickerSet={mode.getListStickers()} stickers={end} setStickers={setEnd} activeSticker={activeSticker} />
                    {lines?.map(([i, j]) =>
                        <LineSegment start={i} end={j} colour={"lime"} key={i.lat} />)
                    }
                    {start.map(([s]) => (<StickerMarker key={s.uuid} position={{
                        lat: s.point.lat,
                        lng: s.point.lng,
                    }} sticker={Mode.STARTPOINT.getListStickers()[s.index]} onDrag={function (e: DragEndEvent): void {
                        throw new Error("Function not implemented.");
                    }} onRemove={function (): void {
                        throw new Error("Function not implemented.");
                    }} />))}
                </>)
        }
    }

    const handleStickerSelect = (index: number) => {
        setActiveSticker(index)
    }


    return (<Page>
        <Centre>
            <Header title={mode.getTitle()} />
            <Suspense fallback={<CircularProgress />}>
                <Stack direction="row">
                    <Map>
                        {DisplayEditor(mode)}
                    </Map>
                    <StickerDrawer
                        stickers={mode.getListStickers()}
                        activeSticker={activeSticker}
                        onStickerClick={handleStickerSelect}
                    />
                </Stack>
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
    public static ROUTE = new Mode("Draw the route for today's journey", [Sticker.Sunny])
    public static STARTPOINT = new Mode("Place a sticker onto your start point", [Sticker.StartPoint])
    public static ENDPOINT = new Mode("Place a sticker onto your end point", [Sticker.Stop])

    private title: string;
    private stickers: Sticker[];

    private constructor(title: string, stickers: Sticker[]) {
        this.title = title;
        this.stickers = stickers;
    }

    public getTitle() {
        return this.title
    }

    public getListStickers() {
        return this.stickers;
    }
}

export default Journey;