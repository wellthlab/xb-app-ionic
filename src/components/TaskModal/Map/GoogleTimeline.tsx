import { Button } from "@mui/joy"
import { LatLng, LatLngLiteral } from "leaflet"
import React from "react"

type GoogleTimelineProps = {
    setLines: React.Dispatch<React.SetStateAction<LatLngLiteral[]>>
}

const GoogleTimeline = function (props: GoogleTimelineProps) {

    const handleFileUpload = function (e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return
        const file = e.target.files[0]
        let fileReader = new FileReader()

        fileReader.onload = (e) => {
            if (!e.target) return
            const kmlText = e.target.result
            
            if (typeof kmlText === 'string') {
                const parser = new DOMParser();
                const kml = parser.parseFromString(kmlText, 'text/xml');
                let googleMarkers = []

                for (const item of kml.getElementsByTagName('Placemark') as HTMLCollectionOf<Element>) {
                    let markers = item.getElementsByTagName('Point')
                    for (const marker of markers) {
                        var coordinates = marker.getElementsByTagName('coordinates')[0].childNodes[0].nodeValue
                        if (!coordinates) break
                        coordinates = coordinates.trim()
                        let coordList = coordinates.split(",")
                        let coordLatLng = new LatLng(+coordList[1], +coordList[0])
                        googleMarkers.push(coordLatLng)
                    }
                }
                props.setLines(googleMarkers)
            }
        }
        fileReader.readAsText(file)
    }

    return (
    <Button component="label" fullWidth>
        Upload from Google Timeline
        <input type="file" hidden onChange={(e) => handleFileUpload(e)} />
    </Button>
    
    )
}

export default GoogleTimeline