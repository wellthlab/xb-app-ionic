import L from "leaflet";
import StickerEditor, { StickersProps } from "./Map/StickerEditor";
import React, { useEffect, useState } from "react";
import LineSegment from "./Map/LineSegment";
import { FormControlProps, Stack, Typography } from "@mui/joy";
import Map from "./Map/Map";
import Routes, { IPoints } from "../../models/Route";
import { Marker } from "react-leaflet";
import Sticker from './Map/sticker'
import SearchBar from "../foundation/SearchBar";

interface StickerPlacerProps extends Omit<FormControlProps, 'onChange'>{
    label: string
    value: string
    onChange: (sticker: string) => void;
}
const StickerPlacer = function (props: StickerPlacerProps) {
    const [stickers, setStickers] = useState<StickersProps[]>([])
    let stickerList: Sticker[] = []
    Object.values(Sticker).forEach(s => {
        stickerList.push(s)
    });
    const [activeSticker, setActiveSticker] = useState<Sticker>(stickerList[0])
    const [stickerResult, setStickerResult] = useState<Sticker[]>(stickerList)
    const [lines, setLines] = useState<IPoints[]>([])
    const startIcon = L.icon({
        iconUrl: `/assets/sticker/${Sticker.StartPoint}.svg`,
        iconSize: [32, 32],
    })
    const endIcon = L.icon({
        iconUrl: `/assets/sticker/${Sticker.Stop}.svg`,
        iconSize: [32, 32],
    })

    const handleStickerSelect = (index: Sticker) => {
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

    const AddRoute = function () {
        if (lines.length > 1) {
            return (<><Marker position={lines[0]} icon={startIcon} />
                <Marker position={lines.slice(-1)[0]} icon={endIcon} />
                {lines?.slice(0, -1).map((i, j) =>
                    <LineSegment start={i} end={lines[j + 1]} colour={"black"} key={i.lat} />)}</>)
        } else {
            return (<></>)
        }
    }

    return (
        <Stack spacing={1}>
            <Typography>
                {props.label}
            </Typography>
            <Map>
                <StickerEditor stickerSet={stickerResult} stickers={stickers} setStickers={setStickers} activeSticker={activeSticker} value={props.value} onChange={props.onChange}/>
                <AddRoute />
            </Map>
            <SearchBar data={stickerList} activeSticker={activeSticker} onStickerClick={handleStickerSelect} stickerList={stickerResult} setStickerList={setStickerResult} />
        </Stack>)
}

export default StickerPlacer