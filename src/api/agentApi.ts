import { Agent, AgentPagingRequest, Response } from 'models';
import axiosClient from './axiosClient';

const agentApi = {
  getAll(params: AgentPagingRequest): Promise<Response<Agent>> {
    const url = '/agents';
    return axiosClient.get(url, { params });
  },
  remove(id: number): Promise<Agent> {
    const url = `/agents/${id}`;
    return axiosClient.delete(url);
  },
  getById(id: string): Promise<Agent> {
    const url = `/agents/${id}`;
    return axiosClient.get(url);
  },
  update(id: string | undefined, data: Agent): Promise<Agent> {
    const formData = new FormData();
    formData.append('LastName', data.lastName);
    formData.append('TransportType', data.transportType.toString());
    formData.append('Color', data.color);
    formData.append('LicencePlate', data.licencePlate);
    formData.append('Phone', data.phone);
    formData.append('TransportDescription', data.transportDescription);
    formData.append('Role', data.role.toString());
    formData.append('Username', data.username);
    formData.append('TeamId', data.teamId.toString());
    formData.append('FirstName', data.firstName);
    formData.append('Email', data.email);
    formData.append('AgentType', data.agentType.toString());
    formData.append('Address', data.address);
    formData.append('Password', data.password);
    formData.append('ImageFile', data.ImageFile);
    const url = `/agents/${id}`;
    return axiosClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  add(data: Agent): Promise<Agent> {
    const formData = new FormData();
    formData.append('LastName', data.lastName);
    formData.append('TransportType', data.transportType.toString());
    formData.append('Color', data.color);
    formData.append('LicencePlate', data.licencePlate);
    formData.append('Phone', data.phone);
    formData.append('TransportDescription', data.transportDescription);
    formData.append('Role', data.role.toString());
    formData.append('Username', data.username);
    formData.append('TeamId', data.teamId.toString());
    formData.append('FirstName', data.firstName);
    formData.append('Email', data.email);
    formData.append('AgentType', data.agentType.toString());
    formData.append('Address', data.address);
    formData.append('Password', data.password);
    formData.append('ImageFile', data.ImageFile);
    const url = '/agents';
    return axiosClient.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};
export default agentApi;
