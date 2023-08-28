import { LatLngLiteral, LeafletEvent, LeafletMouseEvent, } from 'leaflet'
import Sticker from './sticker'
import StickerMarker from './StickerMarker'
import { v4 } from "uuid"
import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet'

function StickerEditor(props: StickerEditorProps) {
    const map = useMap();

    useEffect(() =>
        convertStickersToString(props.stickers),
        [props.stickers])

    useEffect(() => {
        const handleStickerClick = (e: LeafletMouseEvent) => {
            if (!props.stickers) return
            props.setStickers([...props.stickers, { point: e.latlng, sticker: props.activeSticker, note: "", uuid: v4() }])
        }

        map.addEventListener("click", handleStickerClick)

        return function cleanup() {
            map.removeEventListener("click")
        }
    })

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            map.flyTo(e.latlng, map.getZoom());
        });
    }, [map]);

    const convertStickersToString = function (stickers: StickersProps[]) {
        let result = ""
        stickers.map((s) => {
            result += s.sticker.valueOf() + ":" + s.point.lat.toString() + ":" + s.point.lng.toString() + ":" + s.note + ","
        })
        props.onChange(result)
    }

    const handleStickerRemove = (uuid: string) => {
        if (!props.stickers) return
        props.setStickers(props.stickers.filter((p) => p.uuid != uuid))
    }

    const handleStickerDrag = (uuid: string, e: LeafletEvent) => {
        if (!props.stickers) return
        props.setStickers(props.stickers.map((s) =>
            s.uuid === uuid ? { point: e.target.getLatLng(), sticker: s.sticker, note: s.note, uuid: s.uuid } : s
        ),
        )
    }

    const constHandleNoteChange = function (e: React.ChangeEvent<HTMLInputElement>, uuid: string) {
        props.setStickers(props.stickers.map((s) =>
            s.uuid === uuid ? { point: s.point, sticker: s.sticker, note: e.target.value, uuid: s.uuid } : s
        ),)
    }

    return (
        <>
            {props.stickers.map((s) => (<StickerMarker key={s.uuid} position={{
                lat: s.point.lat,
                lng: s.point.lng,
            }} sticker={s.sticker}
                onRemove={() => handleStickerRemove(s.uuid)}
                onDrag={(e) => handleStickerDrag(s.uuid, e)} note={s.note} setNote={(e) => constHandleNoteChange(e, s.uuid)} />))}
        </>
    )
}

export type StickersProps = {
    point: LatLngLiteral,
    sticker: Sticker,
    note: string,
    uuid: string
}

type StickerEditorProps = {
    stickerSet: Sticker[],
    stickers: StickersProps[],
    setStickers: React.Dispatch<React.SetStateAction<StickersProps[]>>,
    activeSticker: Sticker,
    value: string,
    onChange: (sticker: string) => void
}

export default StickerEditor
