import L from 'leaflet';
import icons from 'assets/ics-map/ics-stores.svg';
import poi from 'assets/ics-map/ics-map-pois.svg';
import myStore from 'assets/ics-map/ics-map-store.svg';
import dot from 'assets/ics-map/dot.svg';
import moto from 'assets/ics-map/moto.svg';
import car from 'assets/ics-map/oto.svg';
import truck from 'assets/ics-map/truck.svg';
import markerLocation from 'assets/ics-map/location.svg';

const IconStores = new L.Icon({
  iconSize: [36, 48],
  popupAnchor: [-3, -56],
  iconAnchor: [22, 56],
  iconUrl: icons,
});
const IconPois = new L.Icon({
  iconSize: [42, 56],
  popupAnchor: [-3, -56],
  iconAnchor: [22, 56],
  iconUrl: poi,
});
const IcMarkerLocation = new L.Icon({
  iconSize: [42, 56],
  popupAnchor: [-3, -56],
  iconAnchor: [22, 56],
  iconUrl: markerLocation,
});
const IconMyStore = new L.Icon({
  iconSize: [42, 56],
  popupAnchor: [-3, -56],
  iconAnchor: [22, 56],
  iconUrl: myStore,
});
const IconMoto = new L.Icon({
  className: 'ics-moto',
  iconSize: [42, 56],
  popupAnchor: [-3, -56],
  iconAnchor: [22, 56],
  iconUrl: moto,
});
const IconDot = new L.Icon({
  className: 'ics-dot',
  iconSize: [42, 56],
  popupAnchor: [-3, -56],
  iconAnchor: [22, 56],
  iconUrl: dot,
});
const IconCar = new L.Icon({
  className: 'ics-car',
  iconSize: [42, 56],
  popupAnchor: [-3, -56],
  iconAnchor: [22, 56],
  iconUrl: car,
});
const IconTruck = new L.Icon({
  className: 'ics-truck',
  iconSize: [42, 56],
  popupAnchor: [-3, -56],
  iconAnchor: [22, 56],
  iconUrl: truck,
});

export {
  IconStores,
  IconMyStore,
  IconPois,
  IconCar,
  IconDot,
  IconTruck,
  IconMoto,
  IcMarkerLocation,
};
