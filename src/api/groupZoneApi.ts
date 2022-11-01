import { FreeZone } from 'models/dto/freeZone';
import { GroupZone, GroupZoneDetails, PostGroupZone } from 'models/dto/groupZone';
import axiosClient from './axiosClient';

const groupZoneApi = {
  getAll(): Promise<GroupZone> {
    const url = '/group-zones';
    return axiosClient.get(url);
  },
  getById(id: string): Promise<GroupZoneDetails> {
    const url = `/group-zones/${id}`;
    return axiosClient.get(url);
  },
  remove(id: string): Promise<GroupZoneDetails> {
    const url = `/group-zones/${id}`;
    return axiosClient.delete(url);
  },
  update(id: string, data: GroupZoneDetails): Promise<GroupZoneDetails> {
    const url = `/group-zones/${id}`;
    return axiosClient.put(url, data);
  },
  add(data: PostGroupZone): Promise<GroupZoneDetails> {
    const url = '/group-zones';
    return axiosClient.post(url, data);
  },
  getFreeWard(): Promise<FreeZone> {
    const url = '/group-zones/free-wards';
    return axiosClient.get(url);
  },
  getFreeDistrict(): Promise<FreeZone> {
    const url = '/group-zones/free-districts';
    return axiosClient.get(url);
  },
};
export default groupZoneApi;
