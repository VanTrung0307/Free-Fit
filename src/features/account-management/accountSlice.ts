import { RootState } from 'app/store';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaginationRequest, Response, Template, Brand, Account, Segment } from 'models';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';

export interface AccountState {
  loading: boolean;
  response: Response<Account>;
  accountsInGz: Account[];
  accountsEmptyTz: Account[];
  filter: PaginationRequest;
  filterTemplate: PaginationRequest;
  brands: Segment[];
  templates: Response<Template>;
}

const initialState: AccountState = {
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
  brands: [],
  accountsInGz: [],
  accountsEmptyTz: [],
  templates: {
    pageNumber: 1,
    pageSize: 10,
    results: [],
    totalNumberOfPages: 0,
    totalNumberOfRecords: 0,
  },
  filterTemplate: {
    page: 1,
    pageSize: 9,
  },
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    fetchAccounts(state, action: PayloadAction<PaginationRequest>) {
      state.loading = true;
    },
    fetchAccountSuccess(state, action: PayloadAction<Response<Account>>) {
      state.loading = false;
      state.response = action.payload;
    },
    fetchAccountError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
    fetchBrandType(state) {},
    fetchBrandTypeSuccess(state, action: PayloadAction<Brand[]>) {
      state.brands = action.payload;
    },
    fetchAccountTypeError(state) {},
    setFilter(state, action: PayloadAction<PaginationRequest>) {
      state.filter = action.payload;
    },
    setFilterWithDebounce(state, action: PayloadAction<PaginationRequest>) {},
    fetchAccountTemplates(state, action: PayloadAction<PaginationRequest>) {
      state.loading = true;
    },
    fetchAccountTemplateSuccess(state, action: PayloadAction<Response<Template>>) {
      state.loading = false;
      state.templates = action.payload;
    },
    fetchAccountTemplateError(state) {
      state.loading = false;
      toast.error(i18n.t('common.errorText'));
    },
    setFilterTemplate(state, action: PayloadAction<PaginationRequest>) {
      state.filterTemplate = action.payload;
    },
    setFilterWithDebounceTemplate(state, action: PayloadAction<PaginationRequest>) {},
    // store in gz
    fetchAccountsInGz(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchAccountsInGzSuccess(state, action: PayloadAction<Account[]>) {
      state.loading = false;
      state.accountsInGz = action.payload;
    },
    fetchAccountsInGzError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
    // store empty trade zone
    fetchAccountsEmptyTz(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchAccountsEmptyTzSuccess(state, action: PayloadAction<Account[]>) {
      state.loading = false;
      state.accountsEmptyTz = action.payload;
    },
    fetchAccountsEmptyTzError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
  },
});
// actions
export const accountActions = accountSlice.actions;
// selector
export const selectAccountsResponse = (state: RootState) => state.accounts.response;
export const selectLoading = (state: RootState) => state.accounts.loading;
export const selectFilter = (state: RootState) => state.accounts.filter;
export const selectFilterTemplate = (state: RootState) => state.accounts.filterTemplate;
export const selectBrandType = (state: RootState) => state.accounts.brands;
export const selectTemplate = (state: RootState) => state.accounts.templates;
export const selectBrandTypeOptions = createSelector(selectBrandType, (brandTypes) =>
  brandTypes?.map((brand) => ({
    name: brand?.name,
    id: brand?.id,
  }))
);
export const selectTemplatesOptions = createSelector(selectTemplate, (templates) =>
  templates?.results?.map((template) => ({
    name: template.name,
    id: template.id,
  }))
);
export const selectAccountsOptions = createSelector(selectAccountsResponse, (accounts) =>
  accounts?.results?.map((account) => ({
    name: account.brandName,
    id: account.id,
  }))
);
// stores in gz
export const selectAccountInGz = (state: RootState) => state.accounts.accountsInGz;
export const selectAccountInGzOptions = createSelector(selectAccountInGz, (accounts) =>
  accounts?.map((account) => ({
    name: account.brandName,
    id: account.id,
  }))
);
// store empty trade zone
export const selectAccountEmptyTz = (state: RootState) => state.accounts.accountsEmptyTz;
export const selectAccountEmptyTzOptions = createSelector(selectAccountEmptyTz, (accounts) =>
  accounts?.map((account) => ({
    name: account.brandName,
    id: account.id,
  }))
);

// reducers
const accountReducer = accountSlice.reducer;
export default accountReducer;
