import { FreeWardStyle } from 'constants/freeWardStyle';
import { PayloadAction } from '@reduxjs/toolkit';
import groupZoneApi from 'api/groupZoneApi';
import { FreeZone } from 'models/dto/freeZone';
import { GroupZone } from 'models/dto/groupZone';
import { call, put, takeLatest } from 'redux-saga/effects';
import { groupZoneActions } from './groupZoneSlice';

function* fetchGroupZoneList() {
  try {
    const rs: GroupZone = yield call(groupZoneApi.getAll);
    yield put(groupZoneActions.fetchGroupZoneListSuccess(rs));
  } catch (error) {
    yield put(groupZoneActions.fetchGroupZoneListError());
  }
}
function* fetchFreeZoneList(action: PayloadAction<number>) {
  try {
    if (action.payload === FreeWardStyle.District) {
      const rs: FreeZone = yield call(groupZoneApi.getFreeDistrict);
      yield put(groupZoneActions.fetchFreeZoneSuccess(rs));
    } else if (action.payload === FreeWardStyle.Ward) {
      const rs: FreeZone = yield call(groupZoneApi.getFreeWard);
      yield put(groupZoneActions.fetchFreeZoneSuccess(rs));
    }
  } catch (error) {
    yield put(groupZoneActions.fetchFreeZoneError());
  }
}
export default function* groupZoneSaga() {
  yield takeLatest(groupZoneActions.fetchGroupZoneList.type, fetchGroupZoneList);
  yield takeLatest(groupZoneActions.fetchFreeZoneList.type, fetchFreeZoneList);
}
