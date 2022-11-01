import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import { PaginationRequest, Response, Segment } from 'models';
import segmentApi from 'api/segmentApi';
import { PayloadAction } from '@reduxjs/toolkit';
import { segmentActions } from './segmentSlice';

function* fetchSegment(action: PayloadAction<PaginationRequest>) {
  try {
    const rs: Response<Segment> = yield call(segmentApi.getAllSegmentPaging, action.payload);
    yield put(segmentActions.fetchSegmentSuccess(rs));
  } catch (error) {
    yield put(segmentActions.fetchSegmentError(''));
  }
}
function* searchWithDebounce(action: PayloadAction<PaginationRequest>) {
  yield put(segmentActions.setFilter(action.payload));
}
export default function* storeSaga() {
  // watch fetch student action
  yield takeLatest(segmentActions.fetchSegments.type, fetchSegment);
  yield debounce(800, segmentActions.setFilterWithDebounce.type, searchWithDebounce);
}
