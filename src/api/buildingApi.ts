import { PaginationRequest, Response, Building } from 'models';
import axiosClient from './axiosClient';

const buildingApi = {
  getBuildings(): Promise<Array<Building>> {
    const url = '/buildings';
    return axiosClient.get(url);
  },
  getAllBuildingPaging(params: PaginationRequest): Promise<Response<Building>> {
    const url = '/buildings/paging';
    return axiosClient.get(url, { params });
  },
  getBuildingById(id: number): Promise<Building> {
    const url = `/buildings/${id}`;
    return axiosClient.get(url);
  },
  getBuildingInWard(id: number): Promise<Array<Building>> {
    const url = `/buildings/campus/${id}`;
    return axiosClient.get(url);
  },
  remove(id: number): Promise<Building> {
    const url = `/buildings/${id}`;
    return axiosClient.delete(url);
  },
  add(data: any): Promise<Building> {
    const url = '/buildings';
    return axiosClient.post(url, data);
  },
  update(id: number, data: Building): Promise<Building> {
    const url = `/buildings/${id}`;
    return axiosClient.put(url, data);
  },
};
export default buildingApi;
