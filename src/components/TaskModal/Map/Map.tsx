import { ReactNode, Suspense } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import LocationChanger from './LocationChanger'
import React from 'react'
import "../../../app.css"

function Map(props: MapProps) {
    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution= '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {props.children}
            <LocationChanger />
        </MapContainer>
    )
}

type MapProps = {
    children: ReactNode
}

export default Map
