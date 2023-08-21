import StickerEditor, { StickersProps } from "./Map/StickerEditor";
import React, { useState } from "react";
import { FormControlProps, Stack, Typography } from "@mui/joy";
import Map from "./Map/Map";
import Sticker from './Map/sticker'
import SearchBar from "../foundation/SearchBar";
import DrawRoute from "./Map/DrawRoute";

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


    const handleStickerSelect = (index: Sticker) => {
        setActiveSticker(index)
    }

    return (
        <Stack spacing={1}>
            <Typography>
                {props.label}
            </Typography>
            <Map>
                <StickerEditor stickerSet={stickerList} stickers={stickers} setStickers={setStickers} activeSticker={activeSticker} value={props.value} onChange={props.onChange}/>
                <DrawRoute />
            </Map>
            <SearchBar stickerList={stickerList} activeSticker={activeSticker} onStickerClick={handleStickerSelect} stickerResult={stickerResult} setStickerList={setStickerResult} />
        </Stack>)
}

export default StickerPlacer