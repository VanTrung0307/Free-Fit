import { PaginationRequest } from './common';

export interface Agent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  role: number;
  agentType: number;
  transportType: number;
  teamId: number;
  teamName: string;
  address: string;
  transportDescription: string;
  licencePlate: string;
  color: string;
  createDate: Date;
  image: string;
  status: number;
  previewImage: any;
  ImageFile: any;
}
export interface AgentPagingRequest extends PaginationRequest {
  teamId?: number;
  status?: number;
}
export interface Tracking {
  latitude: Number;
  longitude: Number;
  time: Number;
}
export interface TrackingAgent {
  agent: Agent;
  locations: Tracking[];
}
