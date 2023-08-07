import 'leaflet/dist/leaflet.css'
import { ReactNode } from 'react'
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import LocationChanger from './LocationChanger'
import React from 'react'

function Map(props: MapProps) {
    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: '300px', width: '300px' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
