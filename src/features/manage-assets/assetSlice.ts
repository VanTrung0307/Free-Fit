import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Asset, AssetPagingRequest, Response } from 'models';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';

export interface AssetState {
  loading: boolean;
  assets: Response<Asset>;
  filter: AssetPagingRequest;
}
const initialState: AssetState = {
  loading: false,
  filter: {
    page: 1,
    pageSize: 10,
  },
  assets: {
    pageNumber: 1,
    pageSize: 10,
    results: [],
    totalNumberOfPages: 0,
    totalNumberOfRecords: 0,
  },
};
const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    // poi brands
    fetchAssetList(state, action: PayloadAction<AssetPagingRequest>) {
      state.loading = true;
    },
    fetchAssetListSuccess(state, action: PayloadAction<Response<Asset>>) {
      state.assets = action.payload;
      state.loading = false;
    },
    fetchAssetListError(state) {
      toast.error(i18n.t('common.errorText'));
      state.loading = false;
    },
    // filter
    setFilter(state, action: PayloadAction<AssetPagingRequest>) {
      state.filter = action.payload;
    },
    setFilterWithDebounce(state, action: PayloadAction<AssetPagingRequest>) {},
  },
});
// actions
export const assetActions = assetSlice.actions;
// selectors
export const selectLoading = (state: RootState) => state.asset.loading;
export const selectAssetList = (state: RootState) => state.asset.assets;
export const selectFilter = (state: RootState) => state.asset.filter;
// reducers
const assetReducer = assetSlice.reducer;
export default assetReducer;
