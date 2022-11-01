import {
  Response,
  Poi,
  PoiPagingRequest,
  PostPoiBrand,
  PoiType,
  PostPoi,
  PoiDetails,
} from 'models';
import axiosClient from './axiosClient';

const poiApi = {
  getAll(params: PoiPagingRequest): Promise<Response<Poi>> {
    const url = '/pois';
    return axiosClient.get(url, { params });
  },
  addPoi(data: PostPoi): Promise<Poi> {
    const url = '/pois';
    return axiosClient.post(url, data);
  },
  addPoiBrand(data: PostPoiBrand): Promise<Poi> {
    const url = '/pois/brand';
    return axiosClient.post(url, data);
  },
  updatePoiBrand(data: PostPoiBrand): Promise<Poi> {
    const url = `/pois/${data.poiId}/brand`;
    return axiosClient.put(url, data);
  },
  remove(id: number): Promise<Poi> {
    const url = `/pois/${id}/brand`;
    return axiosClient.delete(url);
  },
  getPoiById(id: string): Promise<PoiDetails> {
    const url = `/pois/${id}`;
    return axiosClient.get(url);
  },
  getPoiTypes(): Promise<PoiType[]> {
    const url = '/pois/poi-type';
    return axiosClient.get(url);
  },
  getPoiBrandById(id: string): Promise<Poi> {
    const url = `/pois/${id}/brand`;
    return axiosClient.get(url);
  },
};
export default poiApi;
