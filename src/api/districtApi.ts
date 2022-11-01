import { PaginationRequest, Response, District } from 'models';
import axiosClient from './axiosClient';

const districtApi = {
  getDistrict(): Promise<Array<District>> {
    const url = '/districts';
    return axiosClient.get(url);
  },
  getAllDistrictPaging(params: PaginationRequest): Promise<Response<District>> {
    const url = '/districts/paging';
    return axiosClient.get(url, { params });
  },
  getDistrictById(id: string): Promise<District> {
    const url = `/districts/${id}`;
    return axiosClient.get(url);
  },
  getDistrictInProvince(id: number): Promise<Array<District>> {
    const url = `/districts/province/${id}`;
    return axiosClient.get(url);
  },
  remove(id: number): Promise<District> {
    const url = `/districts/${id}`;
    return axiosClient.delete(url);
  },
  add(data: any): Promise<District> {
    const url = '/districts';
    return axiosClient.post(url, data);
  },
  update(id: number, data: District): Promise<District> {
    const url = `/districts/${id}`;
    return axiosClient.put(url, data);
  },
};
export default districtApi;
