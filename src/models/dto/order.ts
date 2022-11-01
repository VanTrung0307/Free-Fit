import { Agent, PaginationRequest, Store } from 'models';

export interface Order {
  id: number;
  fromStationId: number;
  toStationId: number;
  batchId: number;
  createdAt: Date;
  updatedAt: Date;
  orderCode: string;
  orderInfo: string;
  status: number;
  packageItems: PackageItem[];
  fromStation: Station;
  toStation: Station;
  store: Store;
  orderInfoObj: OrderInfo;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: number;
  isCOD: boolean;
  shippingFee: number;
  distanceFee: number;
  surCharge: number;
  orderAmount: number;
  notes: string;
  cancelResion: string;
  agent: Agent;
}

export interface Station {
  id: number;
  code: string;
  stationName: string;
  longitude: number;
  latitude: number;
  address: string;
  district: string;
  ward: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface PackageItem {
  id: number;
  quantity: number;
  description: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  itemInfo: string;
  itemInfoObj: ItemInfo;
}
export interface OrderInfo {
  cod: number;
  totalPriceOrder: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  note: string;
  incurred: number;
  serviceCharge: number;
}
export interface ItemInfo {
  img: string;
  name: string;
}
export interface OrderOptions {
  id: number;
  name: string;
}
export interface OrderPagingRequest extends PaginationRequest {
  status?: number;
  fromDate?: string;
  toDate?: string;
  storeId?: number;
  paymentMethod?: number;
}
export interface OrderReport {
  date: string;
  total: number;
  new: number;
  cancel: number;
}

export interface Report {
  totalOrder: number;
  finalAmount: number;
  totalAmount: number;
  totalCodShippingFee: number;
  totalCodDistanceFee: number;
  totalCodSurCharge: number;
  totalShippingFee: number;
  totalDistanceFee: number;
  totalSurCharge: number;
  totalOrderNew: number;
  totalOrderAssigend: number;
  totalOrderRemoved: number;
  totalOrderPickedUp: number;
  totalOrderDelivered: number;
  totalOrderCancel: number;
  fromDate: string;
  toDate: string;
}

export interface ReportFilter {
  dayReport: string;
}

export interface ReportFilterInRange {
  fromDate: string;
  toDate: string;
}

export interface Data {
  status: string;
  value: number[];
}
export interface FilterReport {
  date: string;
  total: number;
  new: number;
  cancel: number;
}

export enum PaymentMethod {
  Cash = 1,
  Bank = 2,
  Momo = 3,
  Paid = 4,
}
