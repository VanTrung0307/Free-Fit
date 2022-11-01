import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Poi, PoiPagingRequest, Response } from 'models';
import { getCurrentUser } from 'utils/common';

const user = getCurrentUser();
export interface PoiBrandState {
  loading: boolean;
  poiBrands: Response<Poi>;
  filter: PoiPagingRequest;
}
const initialState: PoiBrandState = {
  loading: false,
  filter: {
    page: 1,
    pageSize: 10,
    brandId: user === null ? 0 : user.brandId,
    IsGetForPoiBrand: true,
  },
  poiBrands: {
    pageNumber: 1,
    pageSize: 10,
    results: [],
    totalNumberOfPages: 0,
    totalNumberOfRecords: 0,
  },
};
const poiBrandSlice = createSlice({
  name: 'poiBrand',
  initialState,
  reducers: {
    // poi brands
    fetchPoiBrandList(state, action: PayloadAction<PoiPagingRequest>) {
      state.loading = true;
    },
    fetchPoiBrandListSuccess(state, action: PayloadAction<Response<Poi>>) {
      state.poiBrands = action.payload;
      state.loading = false;
    },
    fetchPoiBrandListError(state) {
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
export const poiBrandActions = poiBrandSlice.actions;
// selectors
export const selectLoading = (state: RootState) => state.poiBrands.loading;
export const selectPoiBrandList = (state: RootState) => state.poiBrands.poiBrands;
export const selectFilter = (state: RootState) => state.poiBrands.filter;
// reducers
const poiBrandReducer = poiBrandSlice.reducer;
export default poiBrandReducer;
