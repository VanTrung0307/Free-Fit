import { Asset, AssetPagingRequest, AssetViolation, Response } from 'models';
import axiosClient from './axiosClient';

const assetApi = {
  getAll(params: AssetPagingRequest): Promise<Response<Asset>> {
    const url = '/assets';
    return axiosClient.get(url, { params });
  },
  getAllViolation(params: AssetPagingRequest): Promise<Response<AssetViolation>> {
    const url = '/assets/violation-logs';
    return axiosClient.get(url, { params });
  },
  remove(id: number): Promise<Asset> {
    const url = `/assets/${id}`;
    return axiosClient.delete(url);
  },
  getById(id: string): Promise<Asset> {
    const url = `/assets/${id}`;
    return axiosClient.get(url);
  },
  update(id: string | undefined, data: Asset): Promise<Asset> {
    const url = `/assets/${id}`;
    return axiosClient.put(url, data);
  },
  add(data: Asset): Promise<Asset> {
    const url = '/assets';
    return axiosClient.post(url, data);
  },
};
export default assetApi;
