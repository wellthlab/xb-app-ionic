import { useEffect } from 'react'
import L, { LatLngLiteral, LeafletEvent, LeafletMouseEvent, } from 'leaflet'
import Sticker from './sticker'
import StickerMarker from './StickerMarker'
import { v4 } from "uuid"
import React from 'react'
import { useMap } from 'react-leaflet'

/**Editor allows you to add, drag and remove stickers from the map */
function StickerEditor(props: StickerEditorProps) {
    const map = useMap();

    useEffect(() => {
        const handleStickerClick = (e: LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(e)
            if (!props.stickers) return
            props.setStickers([...props.stickers, { point: e.latlng, index: props.activeSticker, uuid: v4() }])
            convertStickersToString(props.stickers)
        }

        const convertStickersToString = function(stickers: StickersProps[]) {
            let result = ""
            stickers.map((s)=> {
                result = s.point.lat.toString() + " " + s.point.lng.toString() + " " + s.index.getLabel() + " " + s.uuid
            })
            props.onChange(result)
        }

        map.addEventListener("click", handleStickerClick)

        return function cleanup() {
            map.removeEventListener("click")
        }
    })

    const handleStickerRemove = (uuid: string) => {
        if (!props.stickers) return
        props.setStickers(props.stickers.filter((p) => p.uuid != uuid))
    }

    const handleStickerDrag = (uuid: string, e: LeafletEvent) => {
        if (!props.stickers) return
        props.setStickers(props.stickers.map((s) =>
            s.uuid === uuid ? { point: e.target.getLatLng(), index: s.index, uuid: s.uuid } : s
        ),
        )
    }

    return (
        <>
            {props.stickers.map((s) => (<StickerMarker key={s.uuid} position={{
                lat: s.point.lat,
                lng: s.point.lng,
            }} sticker={s.index}
                onRemove={() => handleStickerRemove(s.uuid)}
                onDrag={(e) => handleStickerDrag(s.uuid, e)} />))}
        </>
    )
}

export type StickersProps = {
    point: LatLngLiteral,
    index: Sticker,
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
