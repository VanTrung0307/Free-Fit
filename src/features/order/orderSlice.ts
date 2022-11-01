import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import {
  Building,
  FilterReport,
  Order,
  OrderPagingRequest,
  OrderReport,
  Report,
  ReportFilter,
  ReportFilterInRange,
  Response,
} from 'models';
import moment from 'moment';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';
import { string } from 'yup';

export interface TaskState {
  loading: boolean;
  orders: Response<Order>;
  filter: OrderPagingRequest;
  report: OrderReport;
  filterReport: FilterReport;
  building: Building[];
  reportByDate: any;
  reportInRange: any;
  reportFilter: ReportFilter;
  reportFilterInRange: ReportFilterInRange;
}
export interface ReportToday {
  cancel: number;
  date: string;
  new: number;
  total: number;
}
const initialState: TaskState = {
  loading: false,
  filter: {
    page: 1,
    pageSize: 10,
  },
  reportFilter: {
    dayReport: moment(new Date()).format('YYYY/MM/DD'),
  },
  reportFilterInRange: {
    fromDate: moment(new Date()).format('YYYY/MM/DD'),
    toDate: moment(new Date()).format('YYYY/MM/DD'),
  },
  orders: {
    pageNumber: 1,
    pageSize: 10,
    results: [],
    totalNumberOfPages: 0,
    totalNumberOfRecords: 0,
  },
  report: {
    cancel: 0,
    date: '',
    new: 0,
    total: 0,
  },
  filterReport: {
    cancel: 0,
    date: '',
    new: 0,
    total: 0,
  },
  building: [],
  reportByDate: [],
  reportInRange: [],
};
const orderSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // poi brands
    fetchOrderList(state, action: PayloadAction<OrderPagingRequest>) {
      state.loading = true;
    },
    fetchOrderListSuccess(state, action: PayloadAction<Response<Order>>) {
      state.orders = action.payload;
      state.loading = false;
    },
    fetchOrderListError(state) {
      toast.error(i18n.t('common.errorText'));
      state.loading = false;
    },
    // filter
    setFilter(state, action: PayloadAction<OrderPagingRequest>) {
      state.filter = action.payload;
    },
    setFilterWithDebounce(state, action: PayloadAction<OrderPagingRequest>) {},
    // report
    fetchOrderReport(state, action: PayloadAction<FilterReport>) {
      state.loading = true;
    },
    fetchOrderReportSuccess(state, action: PayloadAction<OrderReport>) {
      state.report = action.payload;
      state.loading = false;
    },
    fetchOrderReportError(state) {
      toast.error(i18n.t('common.errorText'));
      state.loading = false;
    },
    fetchBuilding(state) {
      state.loading = true;
    },
    fetchBuildingsSuccess(state, action: PayloadAction<Building[]>) {
      state.loading = false;
      state.building = action.payload;
    },
    fetchBuildingsError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
    // filter
    setFilterOrderReport(state, action: PayloadAction<FilterReport>) {
      state.filterReport = action.payload;
    },

    setReportFilter(state, action: PayloadAction<ReportFilter>) {
      state.reportFilter = action.payload;
    },
    setReportFilterInRange(state, action: PayloadAction<ReportFilterInRange>) {
      state.reportFilterInRange = action.payload;
    },

    // ReportByDate
    fetchReportByDate(state, action: PayloadAction<ReportFilter>) {
      state.loading = true;
    },
    fetchReportByDateSuccess(state, action: PayloadAction<Report[]>) {
      state.loading = false;
      state.reportByDate = action.payload;
    },
    fetchReportByDateError(state, action: PayloadAction<string>) {
      state.loading = false;
    },

    // ReportInRange
    fetchReportInRange(state, action: PayloadAction<ReportFilterInRange>) {},
    fetchReportInRangeSuccess(state, action: PayloadAction<Report[]>) {
      // state.loading = false;
      state.reportInRange = action.payload;
    },
    fetchReportInRangeError(state, action: PayloadAction<string>) {
      state.loading = false;
    },

    fetchExportExcel(state, action: PayloadAction<ReportFilterInRange>) {
      state.loading = true;
    },
    fetchExportExcelSuccess(state) {
      state.loading = false;
    },
    fetchExportExcelError(state) {
      state.loading = false;
    },
  },
});
// actions
export const orderActions = orderSlice.actions;
// selectors
export const selectBuildingsResponse = (state: RootState) => state.order.building;
export const selectReportByDateResponse = (state: RootState) => state.order.reportByDate;
export const selectReportInRangeResponse = (state: RootState) => state.order.reportInRange;
export const selectLoading = (state: RootState) => state.order.loading;
export const selectOrderList = (state: RootState) => state.order.orders;
export const selectOrderOptions = createSelector(selectOrderList, (orders: any) =>
  orders?.results?.map((order) => ({
    name: order.orderCode,
    id: order.id,
  }))
);
export const selectFilter = (state: RootState) => state.order.filter;
// report
export const selectFilterReport = (state: RootState) => state.order.filterReport;
export const selectReportFilter = (state: RootState) => state.order.reportFilter;
export const selectReportFilterInRange = (state: RootState) => state.order.reportFilterInRange;
export const selectOrderReport = (state: RootState) => state.order.report;
export const selectReport = createSelector(
  selectOrderReport,
  (orders) =>
    ({
      cancel: orders?.cancel || [],
      total: orders?.total || [],
      new: orders?.new || [],
      date: orders?.date || [],
    } as ReportToday)
);
// reducers
const orderReducer = orderSlice.reducer;
export default orderReducer;
