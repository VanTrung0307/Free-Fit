import { PaginationRequest, Response, Campus } from 'models';
import axiosClient from './axiosClient';

const campusApi = {
  getCampus(): Promise<Array<Campus>> {
    const url = '/campus';
    return axiosClient.get(url);
  },
  getAllCampusPaging(params: PaginationRequest): Promise<Response<Campus>> {
    const url = '/campus/paging';
    return axiosClient.get(url, { params });
  },
  getCampusById(id: string): Promise<Campus> {
    const url = `/campus/${id}`;
    return axiosClient.get(url);
  },
  getCampusInWard(id: number): Promise<Array<Campus>> {
    const url = `/campus/ward/${id}`;
    return axiosClient.get(url);
  },
  remove(id: number): Promise<Campus> {
    const url = `/campus/${id}`;
    return axiosClient.delete(url);
  },
  add(data: any): Promise<Campus> {
    const url = '/campus';
    return axiosClient.post(url, data);
  },
  update(id: number, data: Campus): Promise<Campus> {
    const url = `/campus/${id}`;
    return axiosClient.put(url, data);
  },
};
export default campusApi;
