import { LeafletMouseEvent } from 'leaflet'
import { useMap } from 'react-leaflet'

function ClickListener(props: ClickListenerProps) {
  const map = useMap()
  map.addEventListener('click', props.onMapClick)

  return null
}

type ClickListenerProps = {
  onMapClick: (event: LeafletMouseEvent) => void
}

export default ClickListener
