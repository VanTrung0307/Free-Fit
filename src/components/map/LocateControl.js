/* eslint-disable prettier/prettier */
import Locate from 'leaflet.locatecontrol';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { SearchControl, AlgoliaProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/assets/css/leaflet.css';

export default function LocationMarker() {
  const map = useMap();

  useEffect(() => {
    const lc = new Locate({
      icon: 'far fa-dot-circle',
      strings: {
        title: 'Vị trí hiện tại',
      },
    });
    lc.addTo(map);

    const searchControl = new SearchControl({
      style: 'button',
      provider: new AlgoliaProvider(),
    });
    map.addControl(searchControl);
  }, [map]);

  return null;
}
