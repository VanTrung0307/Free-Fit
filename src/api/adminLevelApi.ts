import { Province } from 'models';
import axiosClient from './axiosClient';

const adminLevelApi = {
  getAll(): Promise<Province> {
    const url = '/wards';
    return axiosClient.get(url);
  },
};
export default adminLevelApi;
