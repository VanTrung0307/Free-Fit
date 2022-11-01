import { PostTradeZone, Response, TradeZone, TradeZonePagingRequest } from 'models';
import axiosClient from './axiosClient';

const tradeZoneApi = {
  getAll(params: TradeZonePagingRequest): Promise<Response<TradeZone>> {
    const url = '/trade-zones';
    return axiosClient.get(url, { params });
  },
  remove(storeId: number, versionId: number): Promise<TradeZone> {
    const url = `/trade-zones/${storeId}/${versionId}`;
    return axiosClient.delete(url);
  },
  getById(storeId: number, versionId: number): Promise<TradeZone> {
    const url = `/trade-zones/${storeId}/${versionId}`;
    return axiosClient.get(url);
  },
  update(storeId: number, versionId: number, data: PostTradeZone): Promise<TradeZone> {
    const url = `/trade-zones/${storeId}/${versionId}`;
    return axiosClient.put(url, data);
  },
  add(data: PostTradeZone): Promise<TradeZone> {
    const url = '/trade-zones';
    return axiosClient.post(url, data);
  },
};
export default tradeZoneApi;
