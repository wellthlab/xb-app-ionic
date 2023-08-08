import { ReactNode } from 'react'
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import LocationChanger from './LocationChanger'
import React from 'react'

function Map(props: MapProps) {
    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationChanger />
            {props.children}
        </MapContainer>
    )
}

type MapProps = {
    children: ReactNode
}

export default Map
