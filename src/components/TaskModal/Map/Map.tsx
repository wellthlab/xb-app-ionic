import { ReactNode } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import React from 'react'
import "leaflet/dist/leaflet.css";

type MapProps = {
    children: ReactNode
}

function Map(props: MapProps) {

    // If you don't resize the map after rendering it, then the map won't show properly
    setTimeout(function () {
        window.dispatchEvent(new Event('resize'));
    }, 100);

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
            {props.children}
        </MapContainer>
    )
}

export default Map
