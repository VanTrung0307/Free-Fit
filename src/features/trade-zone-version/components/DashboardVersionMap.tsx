import { makeStyles } from '@mui/styles';
import mapApi from 'api/mapApi';
import { useAppSelector } from 'app/hooks';
import LocationMarker from 'components/map/LocateControl';
import { IconMyStore } from 'components/map/MarkerStyles';
import { selectTradeZoneList } from 'features/trade-zone/tradeZoneSlice';
import L from 'leaflet';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
// eslint-disable-next-line import/extensions
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import { GeoJSONMarker, TradeZone } from 'models';
import { useEffect, useState } from 'react';
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'components/common/style.css';
import LayerMap from 'constants/layerMap';
import { splitPointToLatLng } from 'utils/common';

const useStyle = makeStyles((theme) => ({
  root: {
    height: '40vh',
    borderRadius: '10px',
    overflow: 'hidden',
  },
}));
const colors = [
  'red',
  'maroon',
  'purple',
  'fuchsia',
  'lime',
  'yellow',
  'navy',
  'aqua',
  'darkgreen',
  'deeppink',
  'orange',
  'lightsalmon',
];

export default function DashboardVersionMap() {
  const classes = useStyle();
  // const { t } = useTranslation();
  const tradeZones = useAppSelector(selectTradeZoneList);
  const [myStoreLayer, setMyStoreLayer] = useState<GeoJSONMarker>();
  const centerGz = splitPointToLatLng(tradeZones.results[0]?.center || '');
  useEffect(() => {
    // IFFE
    (async () => {
      try {
        const data: GeoJSONMarker = await mapApi.getMyStores();
        setMyStoreLayer(data);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, []);
  const renderTradeZone = (selected: TradeZone, idx: number) => {
    // var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const colorIndex = Math.floor(Math.random() * colors.length);
    return (
      <GeoJSON
        key={`${selected?.storeId}-${selected?.tradeZoneVersionId}`}
        data={selected?.geom as any}
        style={{
          fill: true,
          color: colors[idx] || colors[colorIndex],
          fillColor: colors[idx] || colors[colorIndex],
          opacity: 0.6,
        }}
        onEachFeature={(feature, layer) => {
          layer.bindPopup(selected?.name || '');
        }}
      />
    );
  };
  return (
    <>
      {centerGz !== undefined ? (
        <MapContainer
          center={centerGz !== undefined ? centerGz : { lat: 10.772461, lng: 106.698055 }}
          zoom={13}
          scrollWheelZoom={true}
          className={classes.root}
          whenCreated={(map) => {
            L.control
              .fullscreen({
                position: 'topleft',
                title: 'Show me the fullscreen !',
                titleCancel: 'Exit fullscreen mode',
                forceSeparateButton: true,
                forcePseudoFullscreen: true,
                fullscreenElement: false,
              })
              .addTo(map);
          }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={LayerMap.Basic}
          />
          <LocationMarker />
          {myStoreLayer?.features.map((e) => (
            <Marker
              key={e.properties.f4}
              icon={IconMyStore}
              position={{
                lat: Number(e.geometry.coordinates[1]),
                lng: Number(e.geometry.coordinates[0]),
              }}
            >
              <Popup>{e.properties.f2}</Popup>
            </Marker>
          ))}
          {tradeZones.results.map((e, idx) => renderTradeZone(e, idx))}
        </MapContainer>
      ) : (
        <></>
      )}
    </>
  );
}
