import { LatLngLiteral } from 'leaflet'
import React from 'react'
import { Polyline } from 'react-leaflet'

function LineSegment({
  start,
  end,
  onClick,
  colour = '#006781',
}: LineSegmentProps) {
  return (
    <>
      <Polyline
        positions={[start, end]}
        weight={5}
        pathOptions={{ color: colour, fillColor: colour }}
        bubblingMouseEvents={false}
        eventHandlers={{
          click: (e: { latlng: any }) => onClick && onClick(start, end, e.latlng),
        }}
      />
    </>
  )
}

type LineSegmentProps = {
  start: LatLngLiteral
  end: LatLngLiteral
  onClick?: (
    start: LatLngLiteral,
    end: LatLngLiteral,
    pos: LatLngLiteral
  ) => void
  colour: string
}

export default LineSegment
