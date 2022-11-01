import { GeoJSONMarker, RequestBounds } from 'models';
import { PostGroupZone } from 'models/dto/groupZone';
import axiosClient from './axiosClient';

const mapApi = {
  getStores(coordinates: RequestBounds): Promise<GeoJSONMarker> {
    const url = '/map/store';
    return axiosClient.post(url, coordinates);
  },
  getPois(coordinates: RequestBounds): Promise<GeoJSONMarker> {
    const url = '/map/pois';
    return axiosClient.post(url, coordinates);
  },
  getMyStores(): Promise<GeoJSONMarker> {
    const url = 'map/store/brand';
    return axiosClient.get(url);
  },
  checkValidGroupZone(data: PostGroupZone): Promise<boolean> {
    const url = '/map/ward/check-group-zone-valid';
    return axiosClient.post(url, data);
  },
};
export default mapApi;
