import { RootState } from 'app/store';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaginationRequest, Response, Segment } from 'models';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';

export interface SegmentState {
  loading: boolean;
  response: Response<Segment>;
  segmentsInGz: Segment[];
  segmentsEmptyTz: Segment[];
  segmentTypes: Segment[];
  filter: PaginationRequest;
  filterTemplate: PaginationRequest;
}
const initialState: SegmentState = {
  loading: false,
  response: {
    pageNumber: 1,
    pageSize: 10,
    results: [],
    totalNumberOfPages: 0,
    totalNumberOfRecords: 0,
  },
  filter: {
    page: 1,
    pageSize: 10,
  },
  segmentTypes: [],
  segmentsInGz: [],
  segmentsEmptyTz: [],
  filterTemplate: {
    page: 1,
    pageSize: 9,
  },
};

const segmentSlice = createSlice({
  name: 'segment',
  initialState,
  reducers: {
    fetchSegments(state, action: PayloadAction<PaginationRequest>) {
      state.loading = true;
    },
    fetchSegmentSuccess(state, action: PayloadAction<Response<Segment>>) {
      state.loading = false;
      state.response = action.payload;
    },
    fetchSegmentError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
    fetchSegmentType(state) {},
    fetchSegmentTypeSuccess(state, action: PayloadAction<Segment[]>) {
      state.segmentTypes = action.payload;
    },
    fetchSegmentTypeError(state) {},
    setFilter(state, action: PayloadAction<PaginationRequest>) {
      state.filter = action.payload;
    },
    setFilterWithDebounce(state, action: PayloadAction<PaginationRequest>) {},
    fetchSegmentTemplates(state, action: PayloadAction<PaginationRequest>) {
      state.loading = true;
    },
    // store in gz
    fetchSegmentsInGz(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchSegmentsInGzSuccess(state, action: PayloadAction<Segment[]>) {
      state.loading = false;
      state.segmentsInGz = action.payload;
    },
    fetchSegmentsInGzError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
    // store empty trade zone
    fetchSegmentsEmptyTz(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchSegmentsEmptyTzSuccess(state, action: PayloadAction<Segment[]>) {
      state.loading = false;
      state.segmentsEmptyTz = action.payload;
    },
    fetchSegmentsEmptyTzError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
  },
});
// actions
export const segmentActions = segmentSlice.actions;
// selector
export const selectSegmentsResponse = (state: RootState) => state.segments.response;
export const selectLoading = (state: RootState) => state.segments.loading;
export const selectFilter = (state: RootState) => state.segments.filter;
export const selectSegmentType = (state: RootState) => state.segments.segmentTypes;
export const selectSegmentTypeOptions = createSelector(selectSegmentType, (segmentTypes) =>
  segmentTypes?.map((segmentType) => ({
    name: segmentType.name,
    id: segmentType.id,
  }))
);
export const selectSegmentsOptions = createSelector(selectSegmentsResponse, (segments) =>
  segments?.results?.map((segment) => ({
    name: segment.name,
    id: segment.id,
  }))
);
// segments in gz
export const selectSegmentInGz = (state: RootState) => state.segments.segmentsInGz;
export const selectSegmentInGzOptions = createSelector(selectSegmentInGz, (segments) =>
  segments?.map((segment) => ({
    name: segment.name,
    id: segment.id,
  }))
);
// segment empty trade zone
export const selectSegmentEmptyTz = (state: RootState) => state.segments.segmentsEmptyTz;
export const selectSegmentEmptyTzOptions = createSelector(selectSegmentEmptyTz, (segments) =>
  segments?.map((segment) => ({
    name: segment.name,
    id: segment.id,
  }))
);

// reducers
const segmentReducer = segmentSlice.reducer;
export default segmentReducer;
