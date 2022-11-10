import { PaginationRequest, Response, Store, StoreType, TradeZone, BrandType } from 'models';
import { AttrResponse } from 'models/dto/attrResponse';
import { Session } from 'models/freefit/session';
import { PostAttr } from '../../models/dto/attr';
import { PostStore, Template, PostTemplate } from '../../models/dto/store';
import axiosClient from '../axiosClient';

const sessionApi = {
  getAll(): Promise<Array<Session>> {
    const url = '/session';
    return axiosClient.get(url);
  },
  getAllPaging(params: PaginationRequest): Promise<Response<Session>> {
    const url = '/exercise/paging';
    return axiosClient.get(url, { params });
  },
  getStoreTypes(): Promise<StoreType[]> {
    const url = '/stores/store-type';
    return axiosClient.get(url);
  },
  getBrandTypes(): Promise<BrandType[]> {
    const url = '/brands';
    return axiosClient.get(url);
  },
  remove(id: number): Promise<Store> {
    const url = `/stores/brand/${id}`;
    return axiosClient.delete(url);
  },
  getExcerciseById(id: string): Promise<Session> {
    const url = `/exercise/${id}`;
    return axiosClient.get(url);
  },
  add(data: PostStore): Promise<Store> {
    const url = '/stores/brand';
    return axiosClient.post(url, data);
  },
  update(id: number, data: PostStore): Promise<Store> {
    const url = `/stores/for-brand/${id}`;
    return axiosClient.put(url, data);
  },
  getAttrField(storeId: string, storeTypeId: string | undefined): Promise<AttrResponse[]> {
    const url = `/stores/${storeId}/store-type/${storeTypeId}/attr-group-details`;
    return axiosClient.get(url);
  },
  getTemplates(params: PaginationRequest): Promise<Template[]> {
    const url = '/stores/templates';
    return axiosClient.get(url, { params });
  },
  updateStoreTemplate(id: string | undefined, data: PostTemplate): Promise<Store> {
    const url = `/stores/${id}/templates`;
    return axiosClient.put(url, data);
  },
  updateAttrs(id: string | undefined, data: PostAttr[]) {
    const url = `/stores/${id}/attrs-insert-value`;
    return axiosClient.put(url, data);
  },
  getStoreTradeZones(id: string): Promise<TradeZone[]> {
    const url = `/stores/${id}/trade-zones`;
    return axiosClient.get(url);
  },
  getStoresInGz(id: number): Promise<Array<Store>> {
    const url = `/stores/group-zone/${id}`;
    return axiosClient.get(url);
  },
  getStoreEmptyTz(id: number): Promise<Array<Store>> {
    const url = `/stores/version/${id}`;
    return axiosClient.get(url);
  },
};
export default sessionApi;
