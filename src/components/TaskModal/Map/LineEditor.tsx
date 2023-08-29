import { LatLngLiteral, LeafletMouseEvent } from "leaflet"
import React, { useEffect } from "react"
import { useMap } from "react-leaflet";
import DrawRoute from "./DrawRoute";

type LineProps = {
    lines: LatLngLiteral[]
    setLines: React.Dispatch<React.SetStateAction<LatLngLiteral[]>>
}

function LineEditor(props: LineProps) {

    const map = useMap();

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            map.flyTo(e.latlng, map.getZoom());
        });
    }, [map]);

    useEffect(() => {
        const handleMapClick = (e: LeafletMouseEvent) => {
            props.setLines([...props.lines, e.latlng])
        }
        map.addEventListener("click", handleMapClick)

        return function cleanup() {
            map.removeEventListener("click")
        }
    })

    return (
        <DrawRoute lines={props.lines} />
    )
}

export default LineEditor