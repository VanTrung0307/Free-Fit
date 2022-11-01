import { OrderPagingRequest, Response, Order, FilterReport, OrderReport, Report } from 'models';
import axiosClient from './axiosClient';

const orderApi = {
  getAll(params: OrderPagingRequest): Promise<Response<Order>> {
    const url = '/orders';
    return axiosClient.get(url, { params });
  },
  getReport(params: FilterReport): Promise<OrderReport> {
    const url = '/orders/report';
    return axiosClient.get(url, { params });
  },
  getReportByDate(params: any): Promise<Report> {
    const url = '/orders/reportByDay';
    return axiosClient.get(url, { params });
  },
  getReportInRange(params: any): Promise<Report> {
    const url = '/orders/reportInRange';
    return axiosClient.get(url, { params });
  },
  getExportExcel(params: any) {
    const url = '/orders/report/export';
    return axiosClient.get(url, { params });
  },
  remove(id: number): Promise<Order> {
    const url = `/orders/${id}`;
    return axiosClient.delete(url);
  },
  getById(id: string): Promise<Order> {
    const url = `/orders/${id}`;
    return axiosClient.get(url);
  },
  update(id: string | undefined, data: Order): Promise<Order> {
    const url = `/orders/${id}`;
    return axiosClient.put(url, data);
  },
  add(data: Order): Promise<Order> {
    const url = '/orders';
    return axiosClient.post(url, data);
  },
};
export default orderApi;
