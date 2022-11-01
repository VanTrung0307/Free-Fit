import { RootState } from 'app/store';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PaginationRequest,
  Response,
  Store,
  StoreType,
  Template,
  Brand,
  BrandType,
  Segment,
} from 'models';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';

export interface BrandState {
  loading: boolean;
  response: Response<Brand>;
  brandsInGz: Brand[];
  brandsEmptyTz: Brand[];
  filter: PaginationRequest;
  filterTemplate: PaginationRequest;
  segmentTypes: Segment[];
  templates: Response<Template>;
}

const initialState: BrandState = {
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
  segmentTypes: [],
  brandsInGz: [],
  brandsEmptyTz: [],
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

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    fetchBrands(state, action: PayloadAction<PaginationRequest>) {
      state.loading = true;
    },
    fetchBrandSuccess(state, action: PayloadAction<Response<Brand>>) {
      state.loading = false;
      state.response = action.payload;
    },
    fetchBrandError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
    fetchSegmentType(state) {},
    fetchSegmentTypeSuccess(state, action: PayloadAction<Segment[]>) {
      state.segmentTypes = action.payload;
    },
    fetchBrandTypeError(state) {},
    setFilter(state, action: PayloadAction<PaginationRequest>) {
      state.filter = action.payload;
    },
    setFilterWithDebounce(state, action: PayloadAction<PaginationRequest>) {},
    fetchBrandTemplates(state, action: PayloadAction<PaginationRequest>) {
      state.loading = true;
    },
    fetchBrandTemplateSuccess(state, action: PayloadAction<Response<Template>>) {
      state.loading = false;
      state.templates = action.payload;
    },
    fetchBrandTemplateError(state) {
      state.loading = false;
      toast.error(i18n.t('common.errorText'));
    },
    setFilterTemplate(state, action: PayloadAction<PaginationRequest>) {
      state.filterTemplate = action.payload;
    },
    setFilterWithDebounceTemplate(state, action: PayloadAction<PaginationRequest>) {},
    // store in gz
    fetchBrandsInGz(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchBrandsInGzSuccess(state, action: PayloadAction<Brand[]>) {
      state.loading = false;
      state.brandsInGz = action.payload;
    },
    fetchBrandsInGzError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
    // store empty trade zone
    fetchBrandsEmptyTz(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchBrandsEmptyTzSuccess(state, action: PayloadAction<Brand[]>) {
      state.loading = false;
      state.brandsEmptyTz = action.payload;
    },
    fetchBrandsEmptyTzError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
  },
});
// actions
export const brandActions = brandSlice.actions;
// selector
export const selectBrandsResponse = (state: RootState) => state.brands.response;
export const selectLoading = (state: RootState) => state.brands.loading;
export const selectFilter = (state: RootState) => state.brands.filter;
export const selectFilterTemplate = (state: RootState) => state.brands.filterTemplate;
export const selectSegmentType = (state: RootState) => state.brands.segmentTypes;
export const selectTemplate = (state: RootState) => state.brands.templates;
export const selectBrandTypeOptions = createSelector(selectSegmentType, (segmentTypes) =>
  segmentTypes?.map((segmentType) => ({
    name: segmentType.name,
    id: segmentType.id,
  }))
);
export const selectTemplatesOptions = createSelector(selectTemplate, (templates) =>
  templates?.results?.map((template) => ({
    name: template.name,
    id: template.id,
  }))
);
export const selectBrandsOptions = createSelector(selectBrandsResponse, (brands) =>
  brands?.results?.map((brand) => ({
    name: brand.name,
    id: brand.id,
  }))
);
// stores in gz
export const selectBrandInGz = (state: RootState) => state.brands.brandsInGz;
export const selectBrandInGzOptions = createSelector(selectBrandInGz, (brands) =>
  brands?.map((brand) => ({
    name: brand.name,
    id: brand.id,
  }))
);
// store empty trade zone
export const selectBrandEmptyTz = (state: RootState) => state.brands.brandsEmptyTz;
export const selectBrandEmptyTzOptions = createSelector(selectBrandEmptyTz, (brands) =>
  brands?.map((brand) => ({
    name: brand.name,
    id: brand.id,
  }))
);

// reducers
const brandReducer = brandSlice.reducer;
export default brandReducer;
