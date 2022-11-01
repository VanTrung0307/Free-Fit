import { AgentPagingRequest, Agent, AssetPagingRequest, Response } from 'models';
import { PayloadAction } from '@reduxjs/toolkit';

import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import agentApi from 'api/agentApi';
import { agentActions } from './agentSlice';

function* fetchAgentList(action: PayloadAction<AgentPagingRequest>) {
  try {
    const rs: Response<Agent> = yield call(agentApi.getAll, action.payload);
    yield put(agentActions.fetchAgentListSuccess(rs));
  } catch (error) {
    yield put(agentActions.fetchAgentListError());
  }
}
function* searchWithDebounce(action: PayloadAction<AssetPagingRequest>) {
  yield put(agentActions.setFilter(action.payload));
}
export default function* agentSaga() {
  yield takeLatest(agentActions.fetchAgentList.type, fetchAgentList);
  yield debounce(800, agentActions.setFilterWithDebounce.type, searchWithDebounce);
}
