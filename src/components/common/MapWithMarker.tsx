import { makeStyles } from '@mui/styles';
import LayerMap from 'constants/layerMap';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
// eslint-disable-next-line import/extensions
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import * as React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import SetMarker from './SetMarker';
import './style.css';

interface MapWithMarkerProps {
  position?: LatLngExpression;
  icon: any;
}
const useStyle = makeStyles((theme) => ({
  root: {
    height: '40vh',
    width: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: '0px',
    border: '2px solid gray',
  },
}));

export default function MapWithMarker({ position, icon }: MapWithMarkerProps) {
  const center: LatLngExpression = [10.772461, 106.698055];
  const classes = useStyle();
  // const map = useMap();
  // map.flyTo(position || center);
  return (
    <MapContainer
      center={position === undefined ? center : position}
      zoom={16}
      scrollWheelZoom={true}
      className={classes.root}
      whenCreated={(map) => {
        L.control
          .fullscreen({
            position: 'topleft', // change the position of the button can be topleft, topright, bottomright or bottomleft, default topleft
            title: 'Show me the fullscreen !', // change the title of the button, default Full Screen
            titleCancel: 'Exit fullscreen mode', // change the title of the button when fullscreen is on, default Exit Full Screen

            forceSeparateButton: true, // force separate button to detach from zoom buttons, default false
            forcePseudoFullscreen: true, // force use of pseudo full screen even if full screen API is available, default false
            fullscreenElement: false, // Dom element to render in full screen, false by default, fallback to map._container
          })
          .addTo(map);
      }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url={LayerMap.Basic}
      />
      <SetMarker position={position} icon={icon} />
    </MapContainer>
  );
}
