import StickerEditor, { StickersProps } from "./Map/StickerEditor";
import React, { useState } from "react";
import { FormControlProps, IconButton, Stack, Typography } from "@mui/joy";
import Map from "./Map/Map";
import Sticker, { findFolder, getKeyFromValue } from './Map/sticker'
import SearchBar from "./Map/SearchBar";
import DrawRoute from "./Map/DrawRoute";
import UndoIcon from '@mui/icons-material/Undo';

interface StickerPlacerProps extends Omit<FormControlProps, 'onChange'> {
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

    const removeLastPoint = function () {
        setStickers(stickers.slice(0, -1))
    }

    const AddStickerToText = function (): JSX.Element {
        const split = props.label.split("$")
        return <> {split.map((s) => {
            const stickerKey = getKeyFromValue(s)
            if (stickerKey != -1) {
                return <img
                    src={findFolder(stickerKey)}
                    width={20}
                    height={20}/>
            } else {
                return s
            }

        })}</>
    }

    return (
        <Stack spacing={1}>
            <Typography>
                <AddStickerToText />
            </Typography>
            <Stack direction="row" spacing={1}>
                <Map>
                    <StickerEditor stickerSet={stickerList} stickers={stickers} setStickers={setStickers} activeSticker={activeSticker} value={props.value} onChange={props.onChange} />
                    <DrawRoute />
                </Map>
                <Stack spacing={1}>
                    <img
                        src={findFolder(activeSticker)}
                        alt={activeSticker}
                        width={32}
                        height={32}
                        style={{ backgroundColor: "white" }} />
                    <IconButton children={<UndoIcon />} onClick={removeLastPoint} />
                </Stack>
            </Stack>

            <SearchBar stickerList={stickerList} activeSticker={activeSticker} onStickerClick={handleStickerSelect} stickerResult={stickerResult} setStickerList={setStickerResult} />
        </Stack>
    )
}

export default StickerPlacer