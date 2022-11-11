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
import clubApi from 'api/FreeFitApi/clubApi';
import { Club } from 'models/freefit/club';
import { clubActions } from './storeSlice';
import { Template } from '../../../models/dto/store';

function* fetchStore(action: PayloadAction<PaginationRequest>) {
  try {
    const rs: Response<Club> = yield call(clubApi.getAllPaging, action.payload);
    yield put(clubActions.fetchClubSuccess(rs));
  } catch (error) {
    yield put(clubActions.fetchStoreError(''));
  }
}
function* fetchStores() {
  try {
    const rs = yield call(storeApi.getAll);
    console.log(rs);
    yield put(clubActions.fetchStoresSuccess(rs));
  } catch (error) {
    yield put(clubActions.fetchStoreError(''));
  }
}
function* fetchStoreType() {
  try {
    const rs: Array<StoreType> = yield call(storeApi.getStoreTypes);
    yield put(clubActions.fetchStoreTypeSuccess(rs));
  } catch (error) {
    yield put(clubActions.fetchStoreTypeError());
  }
}
function* fetchBrandType() {
  try {
    const rs: Array<StoreType> = yield call(storeApi.getBrandTypes);
    yield put(clubActions.fetchBrandTypeSuccess(rs));
  } catch (error) {
    yield put(clubActions.fetchStoreTypeError());
  }
}

function* fetchStoreTemplate(action: PayloadAction<PaginationRequest>) {
  try {
    const rs: Response<Template> = yield call(storeApi.getTemplates, action.payload);
    yield put(clubActions.fetchStoreTemplateSuccess(rs));
  } catch (error) {
    yield put(clubActions.fetchStoreTemplateError());
  }
}
function* searchWithDebounce(action: PayloadAction<PaginationRequest>) {
  yield put(clubActions.setFilter(action.payload));
}
function* searchWithDebounceTemplate(action: PayloadAction<PaginationRequest>) {
  yield put(clubActions.setFilterTemplate(action.payload));
}
function* fetchStoreInGz(action: PayloadAction<number>) {
  try {
    const rs: Store[] = yield call(storeApi.getStoresInGz, action.payload);
    yield put(clubActions.fetchStoresInGzSuccess(rs));
  } catch (error) {
    yield put(clubActions.fetchStoresInGzError(''));
  }
}
function* fetchStoreEmptyTz(action: PayloadAction<number>) {
  try {
    const rs: Store[] = yield call(storeApi.getStoreEmptyTz, action.payload);
    yield put(clubActions.fetchStoresEmptyTzSuccess(rs));
  } catch (error) {
    yield put(clubActions.fetchStoresEmptyTzError(''));
  }
}

function* fetchProvinces() {
  try {
    const rs: Array<Province> = yield call(provinceApi.getProvinces);
    yield put(clubActions.fetchProvinceSuccess(rs));
  } catch (error) {
    yield put(clubActions.fetchProvinceError());
  }
}

function* fetchDistrictInProvince(action: PayloadAction<number>) {
  try {
    const rs: District[] = yield call(districtApi.getDistrictInProvince, action.payload);
    yield put(clubActions.fetchDistrictByProvinceSuccess(rs));
  } catch (error) {
    yield put(clubActions.fetchDistrictByProvinceError(''));
  }
}

function* fetchWardInDistrict(action: PayloadAction<number>) {
  try {
    const rs: Ward[] = yield call(wardApi.getWardInDistrict, action.payload);
    yield put(clubActions.fetchWardByDistrictSuccess(rs));
  } catch (error) {
    yield put(clubActions.fetchWardByDistrictError(''));
  }
}

function* fetchCampusInWard(action: PayloadAction<number>) {
  try {
    const rs: Campus[] = yield call(campusApi.getCampusInWard, action.payload);
    yield put(clubActions.fetchCampusByWardSuccess(rs));
  } catch (error) {
    yield put(clubActions.fetchCampusByWardError(''));
  }
}

function* fetchBuildingInCampus(action: PayloadAction<number>) {
  try {
    const rs: Building[] = yield call(buildingApi.getBuildingInWard, action.payload);
    yield put(clubActions.fetchBuildingByCampusSuccess(rs));
  } catch (error) {
    yield put(clubActions.fetchBuildingByCampusError(''));
  }
}
function* fetchBuildingById(action: PayloadAction<number>) {
  try {
    const rs: Building = yield call(buildingApi.getBuildingById, action.payload);
    yield put(clubActions.fetchBuildingSuccess(rs));
  } catch (error) {
    yield put(clubActions.fetchBuildingError());
  }
}
export default function* storeSaga() {
  // watch fetch student action
  yield takeLatest(clubActions.fetchClub.type, fetchStores);
  yield takeLatest(clubActions.fetchClub.type, fetchStore);
  yield takeLatest(clubActions.fetchStoresEmptyTz.type, fetchStoreEmptyTz);
  yield takeLatest(clubActions.fetchStoresInGz.type, fetchStoreInGz);
  yield takeLatest(clubActions.fetchStoreType.type, fetchStoreType);
  yield takeLatest(clubActions.fetchBrandType.type, fetchBrandType);
  yield takeLatest(clubActions.fetchBuilding.type, fetchBuildingById);
  yield takeLatest(clubActions.fetchProvince.type, fetchProvinces);
  yield takeLatest(clubActions.fetchDistrictByProvince.type, fetchDistrictInProvince);
  yield takeLatest(clubActions.fetchWardByDistrict.type, fetchWardInDistrict);
  yield takeLatest(clubActions.fetchCampusByWard.type, fetchCampusInWard);
  yield takeLatest(clubActions.fetchBuildingByCampus.type, fetchBuildingInCampus);
  yield takeLatest(clubActions.fetchStoreTemplates.type, fetchStoreTemplate);
  yield debounce(800, clubActions.setFilterWithDebounce.type, searchWithDebounce);
  yield debounce(800, clubActions.setFilterWithDebounceTemplate.type, searchWithDebounceTemplate);
}
