import { LeafletMouseEvent } from 'leaflet'
import { useEffect } from 'react';
import { useMap } from 'react-leaflet'

function ClickListener(props: ClickListenerProps) {
  const map = useMap()

  map.addEventListener('click', props.onMapClick)

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, map.getZoom());
  });
  },[map])

  return null
}

type ClickListenerProps = {
  onMapClick: (event: LeafletMouseEvent) => void
}

export default ClickListener
