import L, { LatLngLiteral} from "leaflet";
import StickerEditor from "./Map/StickerEditor";
import React, { useEffect, useState } from "react";
import LineSegment from "./Map/LineSegment";
import { Stack, Typography } from "@mui/joy";
import Map from "./Map/Map";
import StickerDrawer from "./Map/StickerDrawer";
import Routes, { IPoints } from "../../models/Route";
import { Marker } from "react-leaflet";
import Sticker, { valueToKey as stickerToKey } from './Map/sticker'

interface StickerPlacerProps {
    label: string
}
const StickerPlacer = function (props: StickerPlacerProps) {
    const [activeSticker, setActiveSticker] = useState<number>(0)
    const [stickers, setStickers] = useState<[StickersProps][]>([])
    const stickerList = [Sticker.Walking, Sticker.Cycling, Sticker.Car, Sticker.Bus, Sticker.Scooter, Sticker.Tube]
    const [lines, setLines] = useState<IPoints[]>([])
    const startIcon = L.icon({
        iconUrl: `/assets/sticker/${stickerToKey(Sticker.StartPoint)}.svg`,
        iconSize: [32, 32],
      })
      const endIcon = L.icon({
        iconUrl: `/assets/sticker/${stickerToKey(Sticker.Stop)}.svg`,
        iconSize: [32, 32],
      })

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

    const AddRoute = function() {
        if (lines.length > 1) {
            return (<><Marker position={lines[0]} icon={startIcon} />
            <Marker position={lines.slice(-1)[0]} icon={endIcon} />
        {lines?.slice(0, -1).map((i, j) =>
            <LineSegment start={i} end={lines[j + 1]} colour={"lime"} key={i.lat} />)}</>)
        } else {
            return(<></>)
        }
    }

    return (
        <Stack spacing={1}>
            <Typography textAlign="center" level="h3" component="p">
                {props.label}
            </Typography>
            <Stack direction="row">
                <Map>
                    <StickerEditor stickerSet={stickerList} stickers={stickers} setStickers={setStickers} activeSticker={activeSticker} />
                    <AddRoute/>
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