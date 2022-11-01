import { RootState } from 'app/store';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaginationRequest, Response, StoreType } from 'models';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';

export interface StoreTypeState {
  loading: boolean;
  response: Response<StoreType>;
  storeTypesInGz: StoreType[];
  storeTypesEmptyTz: StoreType[];
  storeTypeTypes: StoreType[];
  filter: PaginationRequest;
  filterTemplate: PaginationRequest;
}
const initialState: StoreTypeState = {
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
  storeTypeTypes: [],
  storeTypesInGz: [],
  storeTypesEmptyTz: [],
  filterTemplate: {
    page: 1,
    pageSize: 9,
  },
};

const storeTypeSlice = createSlice({
  name: 'segment',
  initialState,
  reducers: {
    fetchStoreTypes(state, action: PayloadAction<PaginationRequest>) {
      state.loading = true;
    },
    fetchStoreTypeSuccess(state, action: PayloadAction<Response<StoreType>>) {
      state.loading = false;
      state.response = action.payload;
    },
    fetchStoreTypeError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
    fetchStoreTypeType(state) {},
    fetchStoreTypeTypeSuccess(state, action: PayloadAction<StoreType[]>) {
      state.storeTypeTypes = action.payload;
    },
    fetchStoreTypeTypeError(state) {},
    setFilter(state, action: PayloadAction<PaginationRequest>) {
      state.filter = action.payload;
    },
    setFilterWithDebounce(state, action: PayloadAction<PaginationRequest>) {},
    fetchStoreTypeTemplates(state, action: PayloadAction<PaginationRequest>) {
      state.loading = true;
    },
    // store in gz
    fetchStoreTypesInGz(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchStoreTypesInGzSuccess(state, action: PayloadAction<StoreType[]>) {
      state.loading = false;
      state.storeTypesInGz = action.payload;
    },
    fetchStoreTypesInGzError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
    // store empty trade zone
    fetchStoreTypesEmptyTz(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchStoreTypesEmptyTzSuccess(state, action: PayloadAction<StoreType[]>) {
      state.loading = false;
      state.storeTypesEmptyTz = action.payload;
    },
    fetchStoreTypesEmptyTzError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
  },
});
// actions
export const storeTypeActions = storeTypeSlice.actions;
// selector
export const selectStoreTypesResponse = (state: RootState) => state.storeTypes.response;
export const selectLoading = (state: RootState) => state.storeTypes.loading;
export const selectFilter = (state: RootState) => state.storeTypes.filter;
export const selectStoreTypeType = (state: RootState) => state.storeTypes.storeTypeTypes;
export const selectStoreTypeTypeOptions = createSelector(selectStoreTypeType, (storeTypesTypes) =>
  storeTypesTypes?.map((storeTypeType) => ({
    name: storeTypeType.name,
    id: storeTypeType.id,
  }))
);
export const selectStoreTypesOptions = createSelector(selectStoreTypesResponse, (storeTypes) =>
  storeTypes?.results?.map((storeType) => ({
    name: storeType.name,
    id: storeType.id,
  }))
);
// segments in gz
export const selectStoreTypeInGz = (state: RootState) => state.storeTypes.storeTypesInGz;
export const selectStoreTypeInGzOptions = createSelector(selectStoreTypeInGz, (storeTypes) =>
  storeTypes?.map((storeType) => ({
    name: storeType.name,
    id: storeType.id,
  }))
);
// segment empty trade zone
export const selectStoreTypeEmptyTz = (state: RootState) => state.storeTypes.storeTypesEmptyTz;
export const selectStoreTypeEmptyTzOptions = createSelector(selectStoreTypeEmptyTz, (storeTypes) =>
  storeTypes?.map((storeType) => ({
    name: storeType.name,
    id: storeType.id,
  }))
);

// reducers
const segmentReducer = storeTypeSlice.reducer;
export default segmentReducer;
