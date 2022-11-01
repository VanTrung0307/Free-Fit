import { PayloadAction } from '@reduxjs/toolkit';
import buildingApi from 'api/buildingApi';
import orderApi from 'api/orderApi';
import {
  Building,
  FilterReport,
  Order,
  OrderPagingRequest,
  OrderReport,
  ReportFilter,
  ReportFilterInRange,
  Response,
} from 'models';
import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import { orderActions } from './orderSlice';

function* fetchOrderList(action: PayloadAction<OrderPagingRequest>) {
  try {
    const rs: Response<Order> = yield call(orderApi.getAll, action.payload);
    yield put(orderActions.fetchOrderListSuccess(rs));
  } catch (error) {
    yield put(orderActions.fetchOrderListError());
  }
}
function* fetchOrderReport(action: PayloadAction<FilterReport>) {
  try {
    const rs = yield call(orderApi.getReport, action.payload);
    yield put(orderActions.fetchOrderReportSuccess(rs));
  } catch (error) {
    yield put(orderActions.fetchOrderReportError());
  }
}
function* searchWithDebounce(action: PayloadAction<OrderPagingRequest>) {
  yield put(orderActions.setFilter(action.payload));
}
function* fetchBuildings() {
  try {
    const rs = yield call(buildingApi.getBuildings);
    yield put(orderActions.fetchBuildingsSuccess(rs));
  } catch (error) {
    yield put(orderActions.fetchBuildingsError(''));
  }
}
function* fetchReportByDate(action: PayloadAction<ReportFilter>) {
  try {
    const rs = yield call(orderApi.getReportByDate, action.payload);
    yield put(orderActions.fetchReportByDateSuccess(rs));
  } catch (error) {
    yield put(orderActions.fetchReportByDateError(''));
  }
}
function* fetchReportInRange(action: PayloadAction<ReportFilterInRange>) {
  try {
    const rs = yield call(orderApi.getReportInRange, action.payload);
    yield put(orderActions.fetchReportInRangeSuccess(rs));
  } catch (error) {
    yield put(orderActions.fetchReportInRangeError(''));
  }
}
function* fetchExportExcel(action: PayloadAction<ReportFilterInRange>) {
  try {
    const rs = yield call(orderApi.getExportExcel, action.payload);
    yield put(orderActions.fetchExportExcelSuccess());
  } catch (error) {
    yield put(orderActions.fetchExportExcelError());
  }
}
export default function* orderSaga() {
  yield takeLatest(orderActions.fetchOrderList.type, fetchOrderList);
  yield takeLatest(orderActions.fetchOrderReport.type, fetchOrderReport);
  yield debounce(800, orderActions.setFilterWithDebounce.type, searchWithDebounce);
  yield takeLatest(orderActions.fetchBuilding.type, fetchBuildings);
  yield takeLatest(orderActions.fetchReportByDate.type, fetchReportByDate);
  yield takeLatest(orderActions.fetchReportInRange.type, fetchReportInRange);
  yield takeLatest(orderActions.fetchExportExcel.type, fetchExportExcel);
}
