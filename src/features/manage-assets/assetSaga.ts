import { PayloadAction } from '@reduxjs/toolkit';
import assetApi from 'api/assetApi';
import { Asset, AssetPagingRequest, Response } from 'models';
import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import { assetActions } from './assetSlice';

function* fetchAssetList(action: PayloadAction<AssetPagingRequest>) {
  try {
    const rs: Response<Asset> = yield call(assetApi.getAll, action.payload);
    yield put(assetActions.fetchAssetListSuccess(rs));
  } catch (error) {
    yield put(assetActions.fetchAssetListError());
  }
}
function* searchWithDebounce(action: PayloadAction<AssetPagingRequest>) {
  yield put(assetActions.setFilter(action.payload));
}
export default function* assetSaga() {
  yield takeLatest(assetActions.fetchAssetList.type, fetchAssetList);
  yield debounce(800, assetActions.setFilterWithDebounce.type, searchWithDebounce);
}
