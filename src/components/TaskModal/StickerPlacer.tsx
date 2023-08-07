import L, { LatLngLiteral } from "leaflet";
import StickerEditor from "./Map/StickerEditor";
import React, { Suspense, useState } from "react";
import Sticker from "./Map/sticker";
import LineSegment from "./Map/LineSegment";
import { CircularProgress, Stack, Typography } from "@mui/joy";
import Map from "./Map/Map";
import StickerDrawer from "./Map/StickerDrawer";

interface StickerPlacerProps {
    title: string
}
const StickerPlacer = function (props: StickerPlacerProps) {
    const [activeSticker, setActiveSticker] = useState<number>(0)
    const [stickers, setSticikers] = useState<[StickersProps][]>([])
    const stickerList = [Sticker.StartPoint]
    const lines: [LatLngLiteral, LatLngLiteral][] = [[L.latLng(23.4, 45.6), L.latLng(23.4, 45.6)], [L.latLng(23.4, 45.6), L.latLng(23.4, 45.6)]]

    const handleStickerSelect = (index: number) => {
        setActiveSticker(index)
    }

    //Add function to get route

    return (
        <Suspense fallback={<CircularProgress />}><Stack spacing={1}>
            <Typography textAlign="center" level="h1" component="p">
                {props.title}
            </Typography>
            <Map>
                <StickerEditor stickerSet={stickerList} stickers={stickers} setStickers={setSticikers} activeSticker={activeSticker} />
                {lines.map(([i, j]) =>
                    <LineSegment start={i} end={j} colour={"lime"} key={i.lat} />)
                }
                <StickerDrawer
                        stickers={stickerList}
                        activeSticker={activeSticker}
                        onStickerClick={handleStickerSelect}
                    />
            </Map>
        </Stack></Suspense>)
}

type StickersProps = {
    point: LatLngLiteral,
    index: number,
    uuid: string
}

export default StickerPlacer