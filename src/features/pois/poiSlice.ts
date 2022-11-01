import { RootState } from 'app/store';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Poi, PoiPagingRequest, PoiType, Response } from 'models';

export interface PoiState {
  loading: boolean;
  pois: Response<Poi>;
  poiTypes: PoiType[];
  filter: PoiPagingRequest;
}
const initialState: PoiState = {
  loading: false,
  poiTypes: [],
  filter: {
    page: 1,
    pageSize: 10,
  },
  pois: {
    pageNumber: 1,
    pageSize: 10,
    results: [],
    totalNumberOfPages: 0,
    totalNumberOfRecords: 0,
  },
};
const poiSlice = createSlice({
  name: 'poi',
  initialState,
  reducers: {
    // pois
    fetchPoiList(state, action: PayloadAction<PoiPagingRequest>) {
      state.loading = true;
    },
    fetchPoiListSuccess(state, action: PayloadAction<Response<Poi>>) {
      state.pois = action.payload;
      state.loading = false;
    },
    fetchPoiListError(state) {
      state.loading = false;
    },
    // poiTypes
    fetchPoiTypeList(state) {
      state.loading = true;
    },
    fetchPoiTypeListSuccess(state, action: PayloadAction<PoiType[]>) {
      state.poiTypes = action.payload;
      state.loading = false;
    },
    fetchPoiTypeListError(state) {
      state.loading = false;
    },
    // filter
    setFilter(state, action: PayloadAction<PoiPagingRequest>) {
      state.filter = action.payload;
    },
    setFilterWithDebounce(state, action: PayloadAction<PoiPagingRequest>) {},
  },
});
// actions
export const poiActions = poiSlice.actions;
// selectors
export const selectLoading = (state: RootState) => state.poi.loading;
export const selectPoiList = (state: RootState) => state.poi.pois;
export const selectPoiTypeList = (state: RootState) => state.poi.poiTypes;
export const selectFilter = (state: RootState) => state.poi.filter;
export const selectPoiTypeOptions = createSelector(selectPoiTypeList, (poiTypes) =>
  poiTypes?.map((poiType) => ({
    name: poiType.name,
    id: poiType.id,
  }))
);
// reducers
const poiReducer = poiSlice.reducer;
export default poiReducer;
