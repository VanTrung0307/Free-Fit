import { makeStyles } from '@mui/styles';
import MapMenuOption from 'components/common/MapMenuOption';
import LocationMarker from 'components/map/LocateControl';
import {
  IconCar,
  IconDot,
  IconMoto,
  IconMyStore,
  IconPois,
  IconStores,
  IconTruck,
} from 'components/map/MarkerStyles';
import { LayerActive } from 'constants/layer';
import { TransportTypeEnum } from 'constants/transportTypeEnum';
import L from 'leaflet';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
// eslint-disable-next-line import/extensions
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import { GeoJSONMarker, TrackingAgent } from 'models';
import { GetAgentTypeMap } from 'models/dto/agentType';
import { GetTransportTypeMap } from 'models/dto/transportType';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { convertBounds } from 'utils/common';
import './style.css';

interface MapProps {
  stores?: GeoJSONMarker;
  pois?: GeoJSONMarker;
  myStore?: GeoJSONMarker;
  trackings?: TrackingAgent[];
  onChangeBounds: (bounds: string) => void;
  onActiveLayer: (active: LayerActive, bounds: string) => void;
  onCloseLayer: (active: LayerActive) => void;
}
function MapAction({ onChangeBounds, onActiveLayer, onCloseLayer }: MapProps) {
  const map = useMap();

  const { t } = useTranslation();
  // map.addControl()
  const mapEvents = useMapEvents({
    moveend: () => {
      const zoom = mapEvents.getZoom();
      if (zoom > 16) {
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
    marginTop: '0px',
  },
}));
// const colors = [
//   'red',
//   'maroon',
//   'purple',
//   'fuchsia',
//   'lime',
//   'yellow',
//   'navy',
//   'aqua',
//   'darkgreen',
//   'deeppink',
//   'orange',
//   'lightsalmon'
// ];
export default function TrackingMap({
  stores,
  onChangeBounds,
  onActiveLayer,
  onCloseLayer,
  myStore,
  pois,
  trackings,
}: MapProps) {
  const classes = useStyle();
  const { t } = useTranslation();
  const { transportTypeMap } = GetTransportTypeMap();
  const { agentTypeMap } = GetAgentTypeMap();
  const handelBoundsChange = (bounds: string) => {
    if (onChangeBounds) onChangeBounds(bounds);
  };
  const handelActive = (active: LayerActive, bounds: string) => {
    if (onActiveLayer) onActiveLayer(active, bounds);
  };
  const handelClose = (active: LayerActive) => {
    if (onCloseLayer) onCloseLayer(active);
  };
  const renderTracking = (x: TrackingAgent) => {
    // var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    // const colorIndex = Math.floor(Math.random() * colors.length);
    const list: any = [];
    // eslint-disable-next-line array-callback-return
    x.locations.map((a, idx) => {
      if (idx === x.locations.length - 1) {
        let iconMap;
        if (x.agent?.transportType === TransportTypeEnum.Truck) {
          iconMap = IconTruck;
        } else if (x.agent?.transportType === TransportTypeEnum.Motorcycle) {
          iconMap = IconMoto;
        } else if (x.agent?.transportType === TransportTypeEnum.Oto) {
          iconMap = IconCar;
        } else {
          iconMap = IconMoto;
        }
        list.push(
          <Marker
            key={`${x.agent.id}-${idx}`}
            icon={iconMap}
            position={{
              lat: Number(a.latitude),
              lng: Number(a.longitude),
            }}
          >
            <Popup>
              <>
                {`ID: ${x.agent.id}`}
                <br />
                {`${t('agent.name')}: ${x?.agent?.username || 'none'}`}
                <br />
                {`${t('team.name')}: ${x?.agent?.teamName || 'none'}`}
                <br />
                {`${t('agent.transportType')}: ${
                  transportTypeMap[x?.agent?.transportType]?.name || 'none'
                }`}
                <br />
                {`${t('agent.agentType')}: ${agentTypeMap[x?.agent?.agentType]?.name || 'none'}`}
                <br />
                {`${t('agent.licencePlate')}: ${x.agent?.licencePlate || 'none'}`}
                <br />
              </>
            </Popup>
          </Marker>
        );
      } else {
        list.push(
          <Marker
            key={`${x.agent.id}-${idx}`}
            icon={IconDot}
            position={{
              lat: Number(a.latitude),
              lng: Number(a.longitude),
            }}
          />
        );
      }
    });
    return list;
  };
  return (
    <MapContainer
      style={{ marginTop: '0px' }}
      center={{ lat: 10.772461, lng: 106.698055 }}
      zoom={16}
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
      {trackings?.map((e) => renderTracking(e))}
      {/* {trackings
        ?.find((o) => o.agent.id === 1)
        ?.locations?.map((e, idx) => (
          <Marker
            key={idx}
            icon={IconPois}
            position={{
              lat: Number(e.latitude),
              lng: Number(e.longitude)
            }}
          >
            <Popup>{'cc'}</Popup>
          </Marker>
        )) || <></>} */}
    </MapContainer>
  );
}
