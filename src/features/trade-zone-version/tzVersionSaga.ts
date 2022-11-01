import { PayloadAction } from '@reduxjs/toolkit';
import tzVersionApi from 'api/tradeZoneVersionApi';
import { TzVersion, TzVersionRequest } from 'models';
import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import { tzVersionActions } from './tzVersionSlice';

function* fetchTzVersionList(action: PayloadAction<TzVersionRequest>) {
  try {
    const rs: TzVersion[] = yield call(tzVersionApi.getAll, action.payload);
    yield put(tzVersionActions.fetchTzVersionListSuccess(rs));
  } catch (error) {
    yield put(tzVersionActions.fetchTzVersionListError());
  }
}
function* filterWithDebounce(action: PayloadAction<TzVersionRequest>) {
  yield put(tzVersionActions.setFilter(action.payload));
}
export default function* tzVersionSaga() {
  yield takeLatest(tzVersionActions.fetchTzVersionList.type, fetchTzVersionList);
  yield debounce(800, tzVersionActions.setFilterWithDebounce.type, filterWithDebounce);
}
