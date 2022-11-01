import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import { PaginationRequest, Response, Store, StoreType, Brand, BrandType, Segment } from 'models';
import brandApi from 'api/brandApi';
import segmentApi from 'api/segmentApi';
import { PayloadAction } from '@reduxjs/toolkit';
import { brandActions } from './brandSlice';
import { Template } from '../../models/dto/store';

function* fetchBrand(action: PayloadAction<PaginationRequest>) {
  try {
    const rs: Response<Brand> = yield call(brandApi.getAllPaging, action.payload);
    yield put(brandActions.fetchBrandSuccess(rs));
  } catch (error) {
    yield put(brandActions.fetchBrandError(''));
  }
}
function* fetchSegmentType() {
  try {
    const rs: Array<Segment> = yield call(segmentApi.getAllSegment);
    yield put(brandActions.fetchSegmentTypeSuccess(rs));
  } catch (error) {
    yield put(brandActions.fetchBrandTypeError());
  }
}
function* fetchBrandTemplate(action: PayloadAction<PaginationRequest>) {
  try {
    const rs: Response<Template> = yield call(brandApi.getTemplates, action.payload);
    yield put(brandActions.fetchBrandTemplateSuccess(rs));
  } catch (error) {
    yield put(brandActions.fetchBrandTemplateError());
  }
}
function* searchWithDebounce(action: PayloadAction<PaginationRequest>) {
  yield put(brandActions.setFilter(action.payload));
}
function* searchWithDebounceTemplate(action: PayloadAction<PaginationRequest>) {
  yield put(brandActions.setFilterTemplate(action.payload));
}
function* fetchBrandInGz(action: PayloadAction<number>) {
  try {
    const rs: Brand[] = yield call(brandApi.getBrandsInGz, action.payload);
    yield put(brandActions.fetchBrandsInGzSuccess(rs));
  } catch (error) {
    yield put(brandActions.fetchBrandsInGzError(''));
  }
}
function* fetchBrandEmptyTz(action: PayloadAction<number>) {
  try {
    const rs: Brand[] = yield call(brandApi.getBrandEmptyTz, action.payload);
    yield put(brandActions.fetchBrandsEmptyTzSuccess(rs));
  } catch (error) {
    yield put(brandActions.fetchBrandsEmptyTzError(''));
  }
}
export default function* brandSaga() {
  // watch fetch student action
  yield takeLatest(brandActions.fetchBrands.type, fetchBrand);
  yield takeLatest(brandActions.fetchBrandsEmptyTz.type, fetchBrandEmptyTz);
  yield takeLatest(brandActions.fetchBrandsInGz.type, fetchBrandInGz);
  yield takeLatest(brandActions.fetchSegmentType.type, fetchSegmentType);
  yield takeLatest(brandActions.fetchBrandTemplates.type, fetchBrandTemplate);
  yield debounce(800, brandActions.setFilterWithDebounce.type, searchWithDebounce);
  yield debounce(800, brandActions.setFilterWithDebounceTemplate.type, searchWithDebounceTemplate);
}
