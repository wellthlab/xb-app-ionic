import StickerEditor, { StickersProps } from "./Map/StickerEditor";
import React, { useState } from "react";
import { FormControlProps, IconButton, Stack, Typography } from "@mui/joy";
import Map from "./Map/Map";
import Sticker, { Activities, Category, FacilitiesEnvironment, Navigation, Places, Transport, findFolder, getKeyFromValue } from './Map/sticker'
import SearchBar from "./Map/SearchBar";
import DrawRoute from "./Map/DrawRoute";
import UndoIcon from '@mui/icons-material/Undo';
import { LatLngLiteral } from "leaflet";
import StickerDrawer from "./Map/StickerDrawer";

interface StickerPlacerProps extends Omit<FormControlProps, 'onChange'> {
    label: string
    value: string
    onChange: (sticker: string) => void
    points: LatLngLiteral[]
    option: string
}

const StickerPlacer = function (props: StickerPlacerProps) {
    const [stickers, setStickers] = useState<StickersProps[]>([])
    let stickerList: Sticker[] = []
    let category: boolean = true
    let changeCategory: boolean = false

    if (props.option == Category.Activities) {
        stickerList = Activities
    } else if (props.option == Category.Any) {
        Object.values(Sticker).forEach(s => {
            stickerList.push(s)
        })
        changeCategory = true
    } else if (props.option == Category.FacilitiesEnvironment) {
        stickerList = FacilitiesEnvironment
    } else if (props.option == Category.Navigation) {
        stickerList = Navigation
    } else if (props.option == Category.Places) {
        stickerList = Places
    } else if (props.option == Category.Transport) {
        stickerList = Transport
    } else {
        const key = getKeyFromValue(props.option)
        if (key != -1) {
            stickerList.push(key)
        }
        category = false
    }

    const [activeSticker, setActiveSticker] = useState<Sticker>(stickerList[0])
    const [stickerResult, setStickerResult] = useState<Sticker[]>(stickerList)

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
                    height={20} />
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
                    <DrawRoute lines={props.points} />
                    <StickerEditor stickerSet={stickerList} stickers={stickers} setStickers={setStickers} activeSticker={activeSticker} value={props.value} onChange={props.onChange} />
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
            {category ? <>
                <SearchBar stickerList={stickerList} stickerResult={stickerResult} setStickerList={setStickerResult} changeCategory={changeCategory} />
                <StickerDrawer stickers={stickerResult} activeSticker={activeSticker} onStickerClick={setActiveSticker} />
            </> : <></>}
        </Stack>
    )
}

export default StickerPlacer