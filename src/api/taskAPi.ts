import { TaskPagingRequest, Response, Task, PostTask } from 'models';
import axiosClient from './axiosClient';

const taskApi = {
  getAll(params: TaskPagingRequest): Promise<Response<Task>> {
    const url = '/batchs';
    return axiosClient.get(url, { params });
  },
  remove(id: number): Promise<Task> {
    const url = `/batchs/${id}`;
    return axiosClient.delete(url);
  },
  getById(id: string): Promise<Task> {
    const url = `/batchs/${id}`;
    return axiosClient.get(url);
  },
  update(id: string, data: Task): Promise<Task> {
    const url = `/batchs/${id}`;
    return axiosClient.put(url, data);
  },
  add(data: PostTask): Promise<Task> {
    const url = '/batchs';
    return axiosClient.post(url, data);
  },
};
export default taskApi;
