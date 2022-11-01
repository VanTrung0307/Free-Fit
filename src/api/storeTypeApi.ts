import { StoreType, PaginationRequest, Response } from 'models';
import { AnyIfEmpty } from 'react-redux';
import axiosClient from './axiosClient';

const storeTypeApi = {
  getAllStoreType(): Promise<StoreType> {
    const url = '/stores/store-type';
    return axiosClient.get(url);
  },
  getStoreTypeById(id: string): Promise<StoreType> {
    const url = `/stores/store-type/${id}`;
    return axiosClient.get(url);
  },
  getAllStoreTypePaging(params: PaginationRequest): Promise<Response<StoreType>> {
    const url = '/stores/store-type/paging';
    return axiosClient.get(url, { params });
  },
  remove(id: number): Promise<StoreType> {
    const url = `/stores/store-type/${id}`;
    return axiosClient.delete(url);
  },
  add(data: any): Promise<StoreType> {
    const url = '/stores/store-type';
    return axiosClient.post(url, data);
  },
  update(id: number, data: StoreType): Promise<StoreType> {
    const url = `/stores/store-type/${id}`;
    return axiosClient.put(url, data);
  },
};
export default storeTypeApi;
