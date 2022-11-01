import { PayloadAction } from '@reduxjs/toolkit';
import taskApi from 'api/taskAPi';
import { TaskPagingRequest, Response, Task } from 'models';
import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import { taskActions } from './taskSlice';

function* fetchTaskList(action: PayloadAction<TaskPagingRequest>) {
  try {
    const rs: Response<Task> = yield call(taskApi.getAll, action.payload);
    yield put(taskActions.fetchTaskListSuccess(rs));
  } catch (error) {
    yield put(taskActions.fetchTaskListError());
  }
}
function* searchWithDebounce(action: PayloadAction<TaskPagingRequest>) {
  yield put(taskActions.setFilter(action.payload));
}
export default function* taskSaga() {
  yield takeLatest(taskActions.fetchTaskList.type, fetchTaskList);
  yield debounce(800, taskActions.setFilterWithDebounce.type, searchWithDebounce);
}
