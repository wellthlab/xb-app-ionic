import { useEffect, useState } from 'react'
import ClickListener from './utils/ClickListener'
import L, { LatLngLiteral, LeafletEvent, LeafletMouseEvent, } from 'leaflet'
import Sticker from './sticker'
import StickerMarker from './Markers/StickerMarker'
import { v4 } from "uuid"
import React from 'react'
import { useMap } from 'react-leaflet'

/**Editor allows you to add, drag and remove stickers from the map */
function StickerEditor() {
    const supportedStickers =
        Object.keys(Sticker).map((s) => Sticker[s as keyof typeof Sticker])
    const activeSticker = 0
    const [stickers, setStickers] = useState<[StickersProps][]>([])

    const map = useMap();
    useEffect(()=> {
        const handleStickerClick = (e: LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(e)
            console.log("udsifu")
            if (!stickers) return
            setStickers([...stickers, [{ point: e.latlng, index: activeSticker, uuid: v4() }]])
        }

        map.addEventListener("click", handleStickerClick)

        return function cleanup() {
            map.removeEventListener("click")
        }
    })

    const handleStickerRemove = (uuid: string) => {
        if (!stickers) return
        setStickers(stickers.filter(([p]) => p.uuid != uuid))
    }

    const handleStickerDrag = (uuid: string, e: LeafletEvent) => {
        if (!stickers) return
        setStickers(stickers.map(([s]) =>
            s.uuid === uuid ? [{ point: e.target.getLatLng(), index: s.index, uuid: s.uuid }] : [s]
        ),
        )
    }

    return (
        <>
            {stickers.map(([s]) => (<StickerMarker key={s.uuid} position={{
                lat: s.point.lat,
                lng: s.point.lng,
            }} sticker={supportedStickers[s.index]}
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

export default StickerEditor
