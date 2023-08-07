import { useMapEvent } from 'react-leaflet'

function LocationChanger() {
  const map = useMapEvent('locationfound', (e: { latlng: any }) => {
    map.flyTo(e.latlng, 16, {
      duration: 0.1,
    })
  })

  return null
}

export default LocationChanger
