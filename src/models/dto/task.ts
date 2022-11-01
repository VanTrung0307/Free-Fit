import { Agent, Order, OrderOptions, PaginationRequest, Station, User } from 'models';

export interface Task {
  orders: OrderBatch[];
  id: number;
  creatorId: number;
  createdAt: Date;
  updatedAt: Date;
  status: number;
  brandId: number;
  depotId: number;
  depot: Station;
  batchRoutes: BatchRoute[];
  creator?: User;
}
export interface OrderBatch extends Order {
  packageActions: PackageAction[];
}
export interface PackageAction {
  id: number;
  routeEdgeId: number;
  orderId: number;
  actionType: number;
  createdAt: Date;
  updatedAt: Date;
  packageEvidences: PackageEvidence[];
}
export interface BatchRoute {
  id: number;
  batchId: number;
  driverId: number;
  totalLoads: number;
  totalDistance: number;
  createdAt: Date;
  updatedAt: Date;
  driver: Agent;
}
export interface TaskPagingRequest extends PaginationRequest {
  status?: number;
}
export interface PostTask {
  orders: number[];
  orderOptions: OrderOptions[];
  drivers: Driver[];
  agentOptions: AgentOptions[];
  brandId: number;
  creatorId: string;
  startDepot: Station;
  capacity: number;
}

export interface Driver {
  id: number;
  capacity: number;
}
export interface AgentOptions {
  id: number;
  name: string;
}
export interface PackageEvidence {
  id: number;
  caption: string;
  imageUrl: string;
  packageActionId: number;
}
