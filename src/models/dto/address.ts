import { LatLngExpression } from 'leaflet';

export interface Address {
  id: number;
  geom: string;
  housenumber?: string;
  streetname?: string;
  city?: string;
  district?: string;
  streetsegmentid?: number;
  address: string;
  matchingValue: number;
  addressnonutf: string;
  type?: string;
  name?: string;
  postcode?: string;
  latlng: LatLngExpression;
  postLatLng: string;
}
