import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import { PaginationRequest, Response, StoreType } from 'models';
import storeTypeApi from 'api/storeTypeApi';
import { PayloadAction } from '@reduxjs/toolkit';
import { storeTypeActions } from './storeTypeSlice';

function* fetchStoreStype(action: PayloadAction<PaginationRequest>) {
  try {
    const rs: Response<StoreType> = yield call(storeTypeApi.getAllStoreTypePaging, action.payload);
    yield put(storeTypeActions.fetchStoreTypeSuccess(rs));
  } catch (error) {
    yield put(storeTypeActions.fetchStoreTypeError(''));
  }
}

function* fetchStoreTypeType() {
  try {
    const rs: Array<StoreType> = yield call(storeTypeApi.getAllStoreType);
    yield put(storeTypeActions.fetchStoreTypeTypeSuccess(rs));
  } catch (error) {
    yield put(storeTypeActions.fetchStoreTypeTypeError());
  }
}

function* searchWithDebounce(action: PayloadAction<PaginationRequest>) {
  yield put(storeTypeActions.setFilter(action.payload));
}
export default function* storeTypeSaga() {
  // watch fetch student action
  yield takeLatest(storeTypeActions.fetchStoreTypes.type, fetchStoreStype);
  yield takeLatest(storeTypeActions.fetchStoreTypeType.type, fetchStoreTypeType);
  yield debounce(800, storeTypeActions.setFilterWithDebounce.type, searchWithDebounce);
}
