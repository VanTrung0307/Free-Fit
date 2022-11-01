import { PaginationRequest, Response, Ward } from 'models';
import axiosClient from './axiosClient';

const wardApi = {
  getWard(): Promise<Array<Ward>> {
    const url = '/wards';
    return axiosClient.get(url);
  },
  getAllWardPaging(params: PaginationRequest): Promise<Response<Ward>> {
    const url = '/wards/paging';
    return axiosClient.get(url, { params });
  },
  getWardById(id: string): Promise<Ward> {
    const url = `/wards/${id}`;
    return axiosClient.get(url);
  },
  getWardInDistrict(id: number): Promise<Array<Ward>> {
    const url = `/wards/district/${id}`;
    return axiosClient.get(url);
  },
  remove(id: number): Promise<Ward> {
    const url = `/wards/${id}`;
    return axiosClient.delete(url);
  },
  add(data: any): Promise<Ward> {
    const url = '/wards';
    return axiosClient.post(url, data);
  },
  update(id: number, data: Ward): Promise<Ward> {
    const url = `/wards/${id}`;
    return axiosClient.put(url, data);
  },
};
export default wardApi;
