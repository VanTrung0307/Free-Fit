import { FreeZonesRequest } from 'features/trade-zone/tradeZoneSlice';
import { TzVersion } from 'models';
import { FreeZone } from 'models/dto/freeZone';
import { PutTzVersion, TzVersionRequest } from '../models/dto/tradeZone';
import axiosClient from './axiosClient';

const tzVersionApi = {
  getAll(params: TzVersionRequest): Promise<TzVersion[]> {
    const url = '/trade-zone-versions';
    return axiosClient.get(url, { params });
  },
  remove(id: number): Promise<TzVersion> {
    const url = `/trade-zone-versions/${id}`;
    return axiosClient.delete(url);
  },
  getById(id: string): Promise<TzVersion> {
    const url = `/trade-zone-versions/${id}`;
    return axiosClient.get(url);
  },
  update(id: string | undefined, data: PutTzVersion): Promise<TzVersion> {
    const url = `/trade-zone-versions/${id}`;
    return axiosClient.put(url, data);
  },
  add(data: PutTzVersion): Promise<TzVersion> {
    const url = '/trade-zone-versions';
    return axiosClient.post(url, data);
  },
  getFreeWard(rq: FreeZonesRequest): Promise<FreeZone> {
    const url = `/trade-zone-versions/${rq.tzVersionId}/free-wards?tz-id=${rq.tzId}`;
    return axiosClient.get(url);
  },
  getFreeDistrict(rq: FreeZonesRequest): Promise<FreeZone> {
    const url = `/trade-zone-versions/${rq.tzVersionId}/free-districts?tz-id=${rq.tzId}`;
    return axiosClient.get(url);
  },
  getFreeSystemZone(rq: FreeZonesRequest): Promise<FreeZone> {
    const url = `/trade-zone-versions/${rq.tzVersionId}/free-systemzones?tz-id=${rq.tzId}`;
    return axiosClient.get(url);
  },
  active(id: string): Promise<TzVersion> {
    const url = `/trade-zone-versions/${id}/active`;
    return axiosClient.put(url);
  },
  unActive(id: string): Promise<TzVersion> {
    const url = `/trade-zone-versions/${id}/unactive`;
    return axiosClient.put(url);
  },
};
export default tzVersionApi;
