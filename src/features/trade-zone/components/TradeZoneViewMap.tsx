import { makeStyles } from '@mui/styles';
import MapMenuOption from 'components/common/MapMenuOption';
import LocationMarker from 'components/map/LocateControl';
import { IconMyStore, IconPois, IconStores } from 'components/map/MarkerStyles';
import { LayerActive } from 'constants/layer';
import L from 'leaflet';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
// eslint-disable-next-line import/extensions
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import { GeoJSONMarker, TradeZone } from 'models';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GeoJSON, MapContainer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { convertBounds, splitPointToLatLng } from 'utils/common';
import './style.css';

interface MapProps {
  stores?: GeoJSONMarker;
  pois?: GeoJSONMarker;
  myStore?: GeoJSONMarker;
  selectedTradeZone?: TradeZone;
  tradeZones?: TradeZone[];
  listCheck?: Number[];
  onChangeBounds: (bounds: string) => void;
  onActiveLayer: (active: LayerActive, bounds: string) => void;
  onCloseLayer: (active: LayerActive) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  onIsShowAll?: (value: boolean) => void;
}
function MapAction({
  onChangeBounds,
  onActiveLayer,
  onCloseLayer,
  tradeZones,
  listCheck,
}: MapProps) {
  const map = useMap();

  const { t } = useTranslation();
  // map.addControl()
  const mapEvents = useMapEvents({
    moveend: () => {
      const zoom = mapEvents.getZoom();
      if (zoom > 13) {
        const bounds = convertBounds(mapEvents.getBounds());
        if (onChangeBounds) onChangeBounds(bounds);
      }
    },
  });
  useEffect(() => {
    map.on('overlayadd', (e: any) => {
      switch (e.name) {
        case t('map.stores'): {
          const bounds = convertBounds(mapEvents.getBounds());
          onActiveLayer(LayerActive.Stores, bounds);
          break;
        }

        case t('map.pois'): {
          const bounds = convertBounds(mapEvents.getBounds());
          onActiveLayer(LayerActive.Pois, bounds);
          break;
        }

        case t('map.myStore'): {
          const bounds = convertBounds(mapEvents.getBounds());
          onActiveLayer(LayerActive.MyStore, bounds);
          break;
        }
      }
    });
    map.on('overlayremove', (e: any) => {
      switch (e.name) {
        case t('map.stores'):
          onCloseLayer(LayerActive.Stores);
          break;
        case t('map.pois'):
          onCloseLayer(LayerActive.Pois);
          break;
        case t('map.myStore'):
          onCloseLayer(LayerActive.MyStore);
          break;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

const useStyle = makeStyles((theme) => ({
  root: {
    height: '75vh',
    borderRadius: '10px',
    overflow: 'hidden',
  },
}));
const gzSelectedStyle = {
  fill: true,
  color: 'blue',
  fillColor: 'orange',
  opacity: 0.6,
};
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
export default function ViewTradeZoneMap({
  stores,
  onChangeBounds,
  onActiveLayer,
  onCloseLayer,
  myStore,
  selectedTradeZone,
  pois,
  listCheck,
  tradeZones,
}: MapProps) {
  const classes = useStyle();
  const handelBoundsChange = (bounds: string) => {
    if (onChangeBounds) onChangeBounds(bounds);
  };
  const handelActive = (active: LayerActive, bounds: string) => {
    if (onActiveLayer) onActiveLayer(active, bounds);
  };
  const handelClose = (active: LayerActive) => {
    if (onCloseLayer) onCloseLayer(active);
  };

  const renderSelected = (selected: TradeZone, isCheck: boolean, idx: number) => {
    // var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const colorIndex = Math.floor(Math.random() * colors.length);
    return (
      <GeoJSON
        key={`${selected.storeId} ${selected.tradeZoneVersionId}`}
        data={selected?.geom as any}
        style={
          isCheck
            ? {
                fill: true,
                color: colors[idx] || colors[colorIndex],
                fillColor: colors[idx] || colors[colorIndex],
                opacity: 0.6,
              }
            : gzSelectedStyle
        }
        onEachFeature={(feature, layer) => {
          layer.bindPopup(selected?.name || '');
        }}
      />
    );
  };
  const centerGz = splitPointToLatLng(selectedTradeZone?.center || '');
  return (
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
      <MapMenuOption />
      <LocationMarker />
      <MapAction
        onChangeBounds={handelBoundsChange}
        onActiveLayer={handelActive}
        onCloseLayer={handelClose}
      />
      {stores?.features.map((e) => (
        <Marker
          key={e.properties.f4}
          position={{
            lat: Number(e.geometry.coordinates[1]),
            lng: Number(e.geometry.coordinates[0]),
          }}
          icon={IconStores}
        >
          <Popup>{e.properties.f2}</Popup>
        </Marker>
      ))}
      {myStore?.features.map((e) => (
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
      {pois?.features.map((e) => (
        <Marker
          key={e.properties.f4}
          icon={IconPois}
          position={{
            lat: Number(e.geometry.coordinates[0][1]),
            lng: Number(e.geometry.coordinates[0][0]),
          }}
        >
          <Popup>{e.properties.f2}</Popup>
        </Marker>
      ))}

      {listCheck?.length !== 0
        ? listCheck?.map((x, idx) =>
            tradeZones?.find((e) => e.tradeZoneVersionId === x) !== undefined ? (
              renderSelected(
                tradeZones?.find((e) => e.tradeZoneVersionId === x) as TradeZone,
                true,
                idx
              )
            ) : (
              <></>
            )
          )
        : selectedTradeZone && renderSelected(selectedTradeZone, false, 0)}
    </MapContainer>
  );
}
