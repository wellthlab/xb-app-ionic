import StickerEditor, { StickersProps } from "./Map/StickerEditor";
import React, { useEffect, useState } from "react";
import { FormControlProps, IconButton, Stack, Typography } from "@mui/joy";
import Map from "./Map/Map";
import Sticker, { Activities, Category, FacilitiesEnvironment, Navigation, Places, Transport, findFolder, getKeyFromValue } from './Map/sticker'
import StickerSearchBar from "./Map/StickerSearchBar";
import DrawRoute from "./Map/DrawRoute";
import UndoIcon from '@mui/icons-material/Undo';
import { LatLngLiteral } from "leaflet";
import StickerDrawer from "./Map/StickerDrawer";
import DeleteIcon from '@mui/icons-material/Delete';

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
    let addCategory: boolean = true
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
        addCategory = false
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
            return stickerKey != -1 ? <img src={findFolder(stickerKey)} width={20} height={20} /> : s
        })}</>
    }

    const removeStickers = function () {
        setStickers([])
    }

    //Format of payload: "stickerName:lat:lng:notes," comma separates each sticker added
    const convertStickersToString = function () {
        let result = ""
        stickers.map((s) => {
            result += s.sticker.valueOf() + ":" + s.point.lat.toString() + ":" + s.point.lng.toString() + ":" + s.note + ","
        })
        props.onChange(result)
    }

    useEffect(() =>
        convertStickersToString(),
        [stickers]
    )

    return (
        <Stack spacing={1}>
            <Typography> <AddStickerToText /> </Typography>
            <Stack direction="row" spacing={1}>
                <Map>
                    <DrawRoute lines={props.points} />
                    <StickerEditor stickerSet={stickerList} stickers={stickers} setStickers={setStickers} activeSticker={activeSticker} />
                </Map>
                <Stack spacing={1}>
                    <img
                        src={findFolder(activeSticker)}
                        alt={activeSticker}
                        width={32}
                        height={32}
                        style={{ backgroundColor: "white" }} />
                    <IconButton children={<UndoIcon />} onClick={removeLastPoint} />
                    <IconButton children={<DeleteIcon />} onClick={removeStickers} />
                </Stack>
            </Stack>
            {addCategory ? <>
                <StickerSearchBar stickerList={stickerList} stickerResult={stickerResult} setStickerResult={setStickerResult} changeCategory={changeCategory} />
                <StickerDrawer stickers={stickerResult} activeSticker={activeSticker} onStickerClick={setActiveSticker} />
            </> : <></>}
        </Stack>
    )
}

export default StickerPlacer