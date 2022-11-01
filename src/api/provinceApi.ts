import { Province, PaginationRequest, Response } from 'models';
import axiosClient from './axiosClient';

const provinceApi = {
  getProvinces(): Promise<Array<Province>> {
    const url = '/provinces';
    return axiosClient.get(url);
  },
  getAllProvincePaging(params: PaginationRequest): Promise<Response<Province>> {
    const url = '/provinces/paging';
    return axiosClient.get(url, { params });
  },
  getProvinceById(id: string): Promise<Province> {
    const url = `/provinces/${id}`;
    return axiosClient.get(url);
  },
  remove(id: number): Promise<Province> {
    const url = `/provinces/${id}`;
    return axiosClient.delete(url);
  },
  add(data: any): Promise<Province> {
    const url = '/provinces';
    return axiosClient.post(url, data);
  },
  update(id: number, data: Province): Promise<Province> {
    const url = `/provinces/${id}`;
    return axiosClient.put(url, data);
  },
};
export default provinceApi;
