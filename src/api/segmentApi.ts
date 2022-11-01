import { Segment, PaginationRequest, Response } from 'models';
import { AnyIfEmpty } from 'react-redux';
import axiosClient from './axiosClient';

const segmentApi = {
  getAllSegment(): Promise<Segment> {
    const url = '/segment';
    return axiosClient.get(url);
  },
  getAllSegmentPaging(params: PaginationRequest): Promise<Response<Segment>> {
    const url = '/segment/paging';
    return axiosClient.get(url, { params });
  },
  remove(id: number): Promise<Segment> {
    const url = `/segment/${id}`;
    return axiosClient.delete(url);
  },
  add(data: any): Promise<Segment> {
    const url = '/segment';
    return axiosClient.post(url, data);
  },
  update(id: number, data: Segment): Promise<Segment> {
    const url = `/segment/${id}`;
    return axiosClient.put(url, data);
  },
};
export default segmentApi;
