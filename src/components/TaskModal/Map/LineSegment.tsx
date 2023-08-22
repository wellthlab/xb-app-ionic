import { LatLngLiteral } from 'leaflet'
import React from 'react'
import { Polyline } from 'react-leaflet'

function LineSegment(props: LineSegmentProps) {
  return (
    <Polyline
      positions={[props.start, props.end]}
      weight={5}
      pathOptions={{ color: props.colour, fillColor: props.colour }}
    />
  )
}

type LineSegmentProps = {
  start: LatLngLiteral
  end: LatLngLiteral
  colour: string
}

export default LineSegment
