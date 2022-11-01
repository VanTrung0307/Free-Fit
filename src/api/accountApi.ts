import {
  PaginationRequest,
  Response,
  Store,
  TradeZone,
  Segment,
  Brand,
  BrandType,
  Account,
} from 'models';
import { AttrResponse } from 'models/dto/attrResponse';
import { PostAttr } from '../models/dto/attr';
import { Template, PostTemplate, PostBrand, PostAccount } from '../models/dto/store';
import axiosClient from './axiosClient';

const accountApi = {
  getAll(): Promise<Array<Account>> {
    const url = '/accounts';
    return axiosClient.get(url);
  },
  getAllPaging(params: PaginationRequest): Promise<Response<Account>> {
    const url = '/accounts';
    return axiosClient.get(url, { params });
  },
  getBrandTypes(): Promise<Segment[]> {
    const url = '/stores/store-type';
    return axiosClient.get(url);
  },
  remove(id: number): Promise<Account> {
    const url = `/accounts/${id}`;
    return axiosClient.delete(url);
  },
  getAccountById(id: string): Promise<Account> {
    const url = `/accounts/${id}`;
    return axiosClient.get(url);
  },
  add(data: PostAccount): Promise<Account> {
    const url = '/accounts';
    return axiosClient.post(url, data);
  },
  update(id: number, data: PostAccount): Promise<Account> {
    const url = `/accounts/${id}`;
    return axiosClient.put(url, data);
  },
  getAttrField(storeId: string, storeTypeId: string): Promise<AttrResponse[]> {
    const url = `/stores/${storeId}/store-type/${storeTypeId}/attr-group-details`;
    return axiosClient.get(url);
  },
  getTemplates(params: PaginationRequest): Promise<Template[]> {
    const url = '/stores/templates';
    return axiosClient.get(url, { params });
  },
  updateAccountTemplate(id: string, data: PostTemplate): Promise<Store> {
    const url = `/stores/${id}/templates`;
    return axiosClient.put(url, data);
  },
  updateAttrs(id: string, data: PostAttr[]) {
    const url = `/stores/${id}/attrs-insert-value`;
    return axiosClient.put(url, data);
  },
  getAccountTradeZones(id: string): Promise<TradeZone[]> {
    const url = `/stores/${id}/trade-zones`;
    return axiosClient.get(url);
  },
  getAccountsInGz(id: number): Promise<Array<Store>> {
    const url = `/stores/group-zone/${id}`;
    return axiosClient.get(url);
  },
  getAccountEmptyTz(id: number): Promise<Array<Store>> {
    const url = `/stores/version/${id}`;
    return axiosClient.get(url);
  },
};
export default accountApi;
