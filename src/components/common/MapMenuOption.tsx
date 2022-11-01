import { IconStores } from 'components/map/MarkerStyles';
import LayerMap from 'constants/layerMap';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { LayersControl, Marker, TileLayer } from 'react-leaflet';

interface MapActionProps {}

export default function MapMenuOption(props: MapActionProps) {
  const { t } = useTranslation();
  return (
    <LayersControl position="topright">
      <LayersControl.BaseLayer name={t('map.normalLayer')}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url={LayerMap.Default}
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name={t('map.blackWhiteLayer')}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url={LayerMap.BlackWhite}
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer checked name={t('map.basic')}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url={LayerMap.Basic}
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name={t('map.layerDark')}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url={LayerMap.Dark}
        />
      </LayersControl.BaseLayer>
      <LayersControl.Overlay name={t('map.stores')}>
        <Marker position={{ lat: -83.440326, lng: 4.111396 }} icon={IconStores} />
      </LayersControl.Overlay>
      <LayersControl.Overlay name={t('map.pois')}>
        <Marker position={{ lat: -83.440326, lng: 4.111396 }} icon={IconStores} />
      </LayersControl.Overlay>
      <LayersControl.Overlay name={t('map.myStore')}>
        <Marker position={{ lat: -83.440326, lng: 4.111396 }} icon={IconStores} />
      </LayersControl.Overlay>
    </LayersControl>
  );
}
