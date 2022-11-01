import { PaginationRequest, Response, Store, StoreType, TradeZone, Brand, BrandType } from 'models';
import { AttrResponse } from 'models/dto/attrResponse';
import { PostAttr } from '../models/dto/attr';
import { PostStore, Template, PostTemplate, PostBrand } from '../models/dto/store';
import axiosClient from './axiosClient';

const brandApi = {
  getAll(): Promise<Array<Brand>> {
    const url = '/brands';
    return axiosClient.get(url);
  },
  getAllPaging(params: PaginationRequest): Promise<Response<Brand>> {
    const url = '/brands/paging';
    return axiosClient.get(url, { params });
  },
  getBrandTypes(): Promise<BrandType[]> {
    const url = '/stores/store-type';
    return axiosClient.get(url);
  },
  remove(id: number): Promise<Brand> {
    const url = `/brands/${id}`;
    return axiosClient.delete(url);
  },
  getBrandById(id: string): Promise<Brand> {
    const url = `/brands/${id}`;
    return axiosClient.get(url);
  },
  add(data: PostBrand): Promise<Brand> {
    const url = '/brands';
    return axiosClient.post(url, data);
  },
  update(id: number, data: PostBrand): Promise<Brand> {
    const url = `/brands/${id}`;
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
  updateBrandTemplate(id: string, data: PostTemplate): Promise<Store> {
    const url = `/stores/${id}/templates`;
    return axiosClient.put(url, data);
  },
  updateAttrs(id: string, data: PostAttr[]) {
    const url = `/stores/${id}/attrs-insert-value`;
    return axiosClient.put(url, data);
  },
  getBrandTradeZones(id: string): Promise<TradeZone[]> {
    const url = `/stores/${id}/trade-zones`;
    return axiosClient.get(url);
  },
  getBrandsInGz(id: number): Promise<Array<Store>> {
    const url = `/stores/group-zone/${id}`;
    return axiosClient.get(url);
  },
  getBrandEmptyTz(id: number): Promise<Array<Store>> {
    const url = `/stores/version/${id}`;
    return axiosClient.get(url);
  },
};
export default brandApi;
