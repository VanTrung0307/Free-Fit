import { PayloadAction } from '@reduxjs/toolkit';
import poiApi from 'api/poiApi';
import { PaginationRequest, Poi, Response } from 'models';
import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import { poiBrandActions } from './poiBrandSlice';

function* fetchPoiBrandList(action: PayloadAction<PaginationRequest>) {
  try {
    const rs: Response<Poi> = yield call(poiApi.getAll, action.payload);
    yield put(poiBrandActions.fetchPoiBrandListSuccess(rs));
  } catch (error) {
    yield put(poiBrandActions.fetchPoiBrandListError());
  }
}
function* searchWithDebounce(action: PayloadAction<PaginationRequest>) {
  yield put(poiBrandActions.setFilter(action.payload));
}
export default function* poiBrandsSaga() {
  // watch fetch student action
  yield takeLatest(poiBrandActions.fetchPoiBrandList.type, fetchPoiBrandList);
  yield debounce(800, poiBrandActions.setFilterWithDebounce.type, searchWithDebounce);
}
