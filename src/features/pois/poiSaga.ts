import { PayloadAction } from '@reduxjs/toolkit';
import poiApi from 'api/poiApi';
import { PaginationRequest, Poi, PoiType, Response } from 'models';
import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import { poiActions } from './poiSlice';

function* fetchPoiList(action: PayloadAction<PaginationRequest>) {
  try {
    const rs: Response<Poi> = yield call(poiApi.getAll, action.payload);
    yield put(poiActions.fetchPoiListSuccess(rs));
  } catch (error) {
    yield put(poiActions.fetchPoiListError());
  }
}
function* fetchPoiTypeList() {
  try {
    const rs: PoiType[] = yield call(poiApi.getPoiTypes);
    yield put(poiActions.fetchPoiTypeListSuccess(rs));
  } catch (error) {
    yield put(poiActions.fetchPoiTypeListError());
  }
}
function* searchWithDebounce(action: PayloadAction<PaginationRequest>) {
  yield put(poiActions.setFilter(action.payload));
}
export default function* poiSaga() {
  // watch fetch student action
  yield takeLatest(poiActions.fetchPoiList.type, fetchPoiList);
  yield takeLatest(poiActions.fetchPoiTypeList.type, fetchPoiTypeList);
  yield debounce(800, poiActions.setFilterWithDebounce.type, searchWithDebounce);
}
