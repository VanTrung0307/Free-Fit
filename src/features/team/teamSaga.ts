import { PayloadAction } from '@reduxjs/toolkit';
import teamApi from 'api/teamApi';
import { PaginationRequest, Response, Team } from 'models';
import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import { teamActions } from './teamSlice';

function* fetchTeamList(action: PayloadAction<PaginationRequest>) {
  try {
    const rs: Response<Team> = yield call(teamApi.getAll, action.payload);
    yield put(teamActions.fetchTeamListSuccess(rs));
  } catch (error) {
    yield put(teamActions.fetchTeamListError());
  }
}
function* searchWithDebounce(action: PayloadAction<PaginationRequest>) {
  yield put(teamActions.setFilter(action.payload));
}
export default function* teamSaga() {
  yield takeLatest(teamActions.fetchTeamList.type, fetchTeamList);
  yield debounce(800, teamActions.setFilterWithDebounce.type, searchWithDebounce);
}
