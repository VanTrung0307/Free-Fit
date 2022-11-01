import { PaginationRequest, Response, Team } from 'models';
import axiosClient from './axiosClient';

const teamApi = {
  getAll(params: PaginationRequest): Promise<Response<Team>> {
    const url = '/teams';
    return axiosClient.get(url, { params });
  },
  remove(id: number): Promise<Team> {
    const url = `/teams/${id}`;
    return axiosClient.delete(url);
  },
  getById(id: string): Promise<Team> {
    const url = `/teams/${id}`;
    return axiosClient.get(url);
  },
  update(id: string | undefined, data: Team): Promise<Team> {
    const url = `/teams/${id}`;
    return axiosClient.put(url, data);
  },
  add(data: Team): Promise<Team> {
    const url = '/teams';
    return axiosClient.post(url, data);
  },
};
export default teamApi;
