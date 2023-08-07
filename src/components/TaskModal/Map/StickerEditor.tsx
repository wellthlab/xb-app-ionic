import { useEffect, useState } from 'react'
import L, { LatLngLiteral, LeafletEvent, LeafletMouseEvent, } from 'leaflet'
import Sticker from './sticker'
import StickerMarker from './StickerMarker'
import { v4 } from "uuid"
import React from 'react'
import { useMap } from 'react-leaflet'
import StickerDrawer from './StickerDrawer'

/**Editor allows you to add, drag and remove stickers from the map */
function StickerEditor(props: StickerEditorProps) {
    const map = useMap();

    useEffect(() => {
        const handleStickerClick = (e: LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(e)
            if (!props.stickers) return
            props.setStickers([...props.stickers, [{ point: e.latlng, index: props.activeSticker, uuid: v4() }]])
        }

        map.addEventListener("click", handleStickerClick)

        return function cleanup() {
            map.removeEventListener("click")
        }
    })

    const handleStickerRemove = (uuid: string) => {
        if (!props.stickers) return
        props.setStickers(props.stickers.filter(([p]) => p.uuid != uuid))
    }

    const handleStickerDrag = (uuid: string, e: LeafletEvent) => {
        if (!props.stickers) return
        props.setStickers(props.stickers.map(([s]) =>
            s.uuid === uuid ? [{ point: e.target.getLatLng(), index: s.index, uuid: s.uuid }] : [s]
        ),
        )
    }

    return (
        <>
            {props.stickers.map(([s]) => (<StickerMarker key={s.uuid} position={{
                lat: s.point.lat,
                lng: s.point.lng,
            }} sticker={props.stickerSet[s.index]}
                onRemove={() => handleStickerRemove(s.uuid)}
                onDrag={(e) => handleStickerDrag(s.uuid, e)} />))}
        </>
    )
}

type StickersProps = {
    point: LatLngLiteral,
    index: number,
    uuid: string
}

type StickerEditorProps = {
    stickerSet: Sticker[],
    stickers: [StickersProps][],
    setStickers: React.Dispatch<React.SetStateAction<[StickersProps][]>>,
    activeSticker: number,
}

export default StickerEditor
