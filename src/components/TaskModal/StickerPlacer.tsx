import { LatLngLiteral } from "leaflet";
import StickerEditor from "./Map/StickerEditor";
import React, { useEffect, useState } from "react";
import Sticker from "./Map/sticker";
import LineSegment from "./Map/LineSegment";
import { Stack, Typography } from "@mui/joy";
import Map from "./Map/Map";
import StickerDrawer from "./Map/StickerDrawer";
import Routes, { IPoints } from "../../models/Route";

interface StickerPlacerProps {
    label: string
}
const StickerPlacer = function (props: StickerPlacerProps) {
    const [activeSticker, setActiveSticker] = useState<number>(0)
    const [stickers, setSticikers] = useState<[StickersProps][]>([])
    const stickerList = [Sticker.Walking, Sticker.Cycling]
    const [lines, setLines] = useState<IPoints[]>([])

    const handleStickerSelect = (index: number) => {
        setActiveSticker(index)
    }

    useEffect(() => {
        getTodayRoute()
    }, []
    )

    const getTodayRoute = async function () {
        const raw = await Routes.getRoutes();
        setLines(raw[0].route)
    }

    return (
        <Stack spacing={1}>
            <Typography textAlign="center" level="h3" component="p">
                {props.label}
            </Typography>
            <Stack direction="row">
                <Map>
                    <StickerEditor stickerSet={stickerList} stickers={stickers} setStickers={setSticikers} activeSticker={activeSticker} />
                    {lines?.slice(0, -1).map((i, j) =>
                        <LineSegment start={i} end={lines[j + 1]} colour={"lime"} key={i.lat} />)}
                </Map>
                <StickerDrawer
                    stickers={stickerList}
                    activeSticker={activeSticker}
                    onStickerClick={handleStickerSelect}
                />
            </Stack>
        </Stack>)
}

type StickersProps = {
    point: LatLngLiteral,
    index: number,
    uuid: string
}

export default StickerPlacer