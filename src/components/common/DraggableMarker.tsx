import { LatLngExpression } from 'leaflet';
import { useMemo, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';

interface DraggableMarkerProps {
  location?: LatLngExpression;
  onDraggable: (point: LatLngExpression) => void;
  icon: any;
}
export function DraggableMarker({ location, onDraggable, icon }: DraggableMarkerProps) {
  const markerRef = useRef(null);
  const map = useMap();
  if (location) map.flyTo(location);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker: any = markerRef.current;
        if (marker != null) {
          if (onDraggable) onDraggable(marker.getLatLng());
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  if (!location) return <></>;
  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={location}
      ref={markerRef}
      icon={icon}
    >
      <Popup minWidth={90}>
        <span>{location.toString()}</span>
      </Popup>
    </Marker>
  );
}
