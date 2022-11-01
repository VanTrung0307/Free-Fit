import { Province } from 'models';
import adminLevelApi from 'api/adminLevelApi';
import { call, put, takeLatest } from 'redux-saga/effects';
import { adminLevelActions } from './adminLevelSlice';

function* fetchAdminLevelData() {
  try {
    const rs: Province[] = yield call(adminLevelApi.getAll);
    yield put(adminLevelActions.fetchAdminLevelDataSuccess(rs));
  } catch (error) {
    yield put(adminLevelActions.fetchAdminLevelDataError());
  }
}

export default function* adminLevelSaga() {
  yield takeLatest(adminLevelActions.fetchAdminLevelData.type, fetchAdminLevelData);
}
