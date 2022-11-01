import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import {
  PaginationRequest,
  Response,
  Store,
  StoreType,
  Province,
  District,
  Ward,
  Campus,
  Building,
} from 'models';
import storeApi from 'api/storeApi';
import districtApi from 'api/districtApi';
import provinceApi from 'api/provinceApi';
import wardApi from 'api/wardApi';
import campusApi from 'api/campusApi';
import buildingApi from 'api/buildingApi';
import { PayloadAction } from '@reduxjs/toolkit';
import { functions } from 'lodash';
import { storeActions } from './storeSlice';
import { Template } from '../../models/dto/store';

function* fetchStore(action: PayloadAction<PaginationRequest>) {
  try {
    const rs: Response<Store> = yield call(storeApi.getAllPaging, action.payload);
    yield put(storeActions.fetchStoreSuccess(rs));
  } catch (error) {
    yield put(storeActions.fetchStoreError(''));
  }
}
function* fetchStores() {
  try {
    const rs = yield call(storeApi.getAll);
    console.log(rs);
    yield put(storeActions.fetchStoresSuccess(rs));
  } catch (error) {
    yield put(storeActions.fetchStoreError(''));
  }
}
function* fetchStoreType() {
  try {
    const rs: Array<StoreType> = yield call(storeApi.getStoreTypes);
    yield put(storeActions.fetchStoreTypeSuccess(rs));
  } catch (error) {
    yield put(storeActions.fetchStoreTypeError());
  }
}
function* fetchBrandType() {
  try {
    const rs: Array<StoreType> = yield call(storeApi.getBrandTypes);
    yield put(storeActions.fetchBrandTypeSuccess(rs));
  } catch (error) {
    yield put(storeActions.fetchStoreTypeError());
  }
}

function* fetchStoreTemplate(action: PayloadAction<PaginationRequest>) {
  try {
    const rs: Response<Template> = yield call(storeApi.getTemplates, action.payload);
    yield put(storeActions.fetchStoreTemplateSuccess(rs));
  } catch (error) {
    yield put(storeActions.fetchStoreTemplateError());
  }
}
function* searchWithDebounce(action: PayloadAction<PaginationRequest>) {
  yield put(storeActions.setFilter(action.payload));
}
function* searchWithDebounceTemplate(action: PayloadAction<PaginationRequest>) {
  yield put(storeActions.setFilterTemplate(action.payload));
}
function* fetchStoreInGz(action: PayloadAction<number>) {
  try {
    const rs: Store[] = yield call(storeApi.getStoresInGz, action.payload);
    yield put(storeActions.fetchStoresInGzSuccess(rs));
  } catch (error) {
    yield put(storeActions.fetchStoresInGzError(''));
  }
}
function* fetchStoreEmptyTz(action: PayloadAction<number>) {
  try {
    const rs: Store[] = yield call(storeApi.getStoreEmptyTz, action.payload);
    yield put(storeActions.fetchStoresEmptyTzSuccess(rs));
  } catch (error) {
    yield put(storeActions.fetchStoresEmptyTzError(''));
  }
}

function* fetchProvinces() {
  try {
    const rs: Array<Province> = yield call(provinceApi.getProvinces);
    yield put(storeActions.fetchProvinceSuccess(rs));
  } catch (error) {
    yield put(storeActions.fetchProvinceError());
  }
}

function* fetchDistrictInProvince(action: PayloadAction<number>) {
  try {
    const rs: District[] = yield call(districtApi.getDistrictInProvince, action.payload);
    yield put(storeActions.fetchDistrictByProvinceSuccess(rs));
  } catch (error) {
    yield put(storeActions.fetchDistrictByProvinceError(''));
  }
}

function* fetchWardInDistrict(action: PayloadAction<number>) {
  try {
    const rs: Ward[] = yield call(wardApi.getWardInDistrict, action.payload);
    yield put(storeActions.fetchWardByDistrictSuccess(rs));
  } catch (error) {
    yield put(storeActions.fetchWardByDistrictError(''));
  }
}

function* fetchCampusInWard(action: PayloadAction<number>) {
  try {
    const rs: Campus[] = yield call(campusApi.getCampusInWard, action.payload);
    yield put(storeActions.fetchCampusByWardSuccess(rs));
  } catch (error) {
    yield put(storeActions.fetchCampusByWardError(''));
  }
}

function* fetchBuildingInCampus(action: PayloadAction<number>) {
  try {
    const rs: Building[] = yield call(buildingApi.getBuildingInWard, action.payload);
    yield put(storeActions.fetchBuildingByCampusSuccess(rs));
  } catch (error) {
    yield put(storeActions.fetchBuildingByCampusError(''));
  }
}
function* fetchBuildingById(action: PayloadAction<number>) {
  try {
    const rs: Building = yield call(buildingApi.getBuildingById, action.payload);
    yield put(storeActions.fetchBuildingSuccess(rs));
  } catch (error) {
    yield put(storeActions.fetchBuildingError());
  }
}
export default function* storeSaga() {
  // watch fetch student action
  yield takeLatest(storeActions.fetchStore.type, fetchStores);
  yield takeLatest(storeActions.fetchStores.type, fetchStore);
  yield takeLatest(storeActions.fetchStoresEmptyTz.type, fetchStoreEmptyTz);
  yield takeLatest(storeActions.fetchStoresInGz.type, fetchStoreInGz);
  yield takeLatest(storeActions.fetchStoreType.type, fetchStoreType);
  yield takeLatest(storeActions.fetchBrandType.type, fetchBrandType);
  yield takeLatest(storeActions.fetchBuilding.type, fetchBuildingById);
  yield takeLatest(storeActions.fetchProvince.type, fetchProvinces);
  yield takeLatest(storeActions.fetchDistrictByProvince.type, fetchDistrictInProvince);
  yield takeLatest(storeActions.fetchWardByDistrict.type, fetchWardInDistrict);
  yield takeLatest(storeActions.fetchCampusByWard.type, fetchCampusInWard);
  yield takeLatest(storeActions.fetchBuildingByCampus.type, fetchBuildingInCampus);
  yield takeLatest(storeActions.fetchStoreTemplates.type, fetchStoreTemplate);
  yield debounce(800, storeActions.setFilterWithDebounce.type, searchWithDebounce);
  yield debounce(800, storeActions.setFilterWithDebounceTemplate.type, searchWithDebounceTemplate);
}
