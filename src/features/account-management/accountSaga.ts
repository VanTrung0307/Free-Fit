import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import { PaginationRequest, Response, Store, StoreType, Account, Segment, Brand } from 'models';
import accountApi from 'api/accountApi';
import brandApi from 'api/brandApi';
import { PayloadAction } from '@reduxjs/toolkit';
import { accountActions } from './accountSlice';
import { Template } from '../../models/dto/store';

function* fetchAccount(action: PayloadAction<PaginationRequest>) {
  try {
    const rs: Response<Account> = yield call(accountApi.getAllPaging, action.payload);
    yield put(accountActions.fetchAccountSuccess(rs));
  } catch (error) {
    yield put(accountActions.fetchAccountError(''));
  }
}
function* fetchBrandType() {
  try {
    const rs: Array<Brand> = yield call(brandApi.getAll);
    yield put(accountActions.fetchBrandTypeSuccess(rs));
  } catch (error) {
    yield put(accountActions.fetchAccountTypeError());
  }
}
function* fetchAccountTemplate(action: PayloadAction<PaginationRequest>) {
  try {
    const rs: Response<Template> = yield call(accountApi.getTemplates, action.payload);
    yield put(accountActions.fetchAccountTemplateSuccess(rs));
  } catch (error) {
    yield put(accountActions.fetchAccountTemplateError());
  }
}
function* searchWithDebounce(action: PayloadAction<PaginationRequest>) {
  yield put(accountActions.setFilter(action.payload));
}
function* searchWithDebounceTemplate(action: PayloadAction<PaginationRequest>) {
  yield put(accountActions.setFilterTemplate(action.payload));
}
function* fetchAccountInGz(action: PayloadAction<number>) {
  try {
    const rs: Account[] = yield call(accountApi.getAccountsInGz, action.payload);
    yield put(accountActions.fetchAccountsInGzSuccess(rs));
  } catch (error) {
    yield put(accountActions.fetchAccountsInGzError(''));
  }
}
function* fetchAccountEmptyTz(action: PayloadAction<number>) {
  try {
    const rs: Account[] = yield call(accountApi.getAccountEmptyTz, action.payload);
    yield put(accountActions.fetchAccountsEmptyTzSuccess(rs));
  } catch (error) {
    yield put(accountActions.fetchAccountsEmptyTzError(''));
  }
}
export default function* accountSaga() {
  // watch fetch student action
  yield takeLatest(accountActions.fetchAccounts.type, fetchAccount);
  yield takeLatest(accountActions.fetchAccountsEmptyTz.type, fetchAccountEmptyTz);
  yield takeLatest(accountActions.fetchAccountsInGz.type, fetchAccountInGz);
  yield takeLatest(accountActions.fetchBrandType.type, fetchBrandType);
  yield takeLatest(accountActions.fetchAccountTemplates.type, fetchAccountTemplate);
  yield debounce(800, accountActions.setFilterWithDebounce.type, searchWithDebounce);
  yield debounce(
    800,
    accountActions.setFilterWithDebounceTemplate.type,
    searchWithDebounceTemplate
  );
}
