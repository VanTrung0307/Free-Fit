import { RootState } from 'app/store';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PaginationRequest,
  Response,
  Store,
  StoreType,
  Template,
  BrandType,
  Province,
  District,
  Ward,
  Campus,
  Building,
} from 'models';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';
import { Club } from 'models/freefit/club';

export interface StoreState {
  loading: boolean;
  response: Response<Club>;
  storesInGz: Store[];
  storesEmptyTz: Store[];
  filter: PaginationRequest;
  filterTemplate: PaginationRequest;
  storeTypes: StoreType[];
  brandTypes: BrandType[];
  provinces: Province[];
  building: Building;
  districtsByProvince: District[];
  wardsByDistrict: Ward[];
  campusesByWard: Campus[];
  buildingsByCampus: Building[];
  templates: Response<Template>;
}
const initialState: StoreState = {
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
  storeTypes: [],
  brandTypes: [],
  provinces: [],
  building: {
    id: 0,
    name: '',
  },
  districtsByProvince: [],
  wardsByDistrict: [],
  campusesByWard: [],
  buildingsByCampus: [],
  storesInGz: [],
  storesEmptyTz: [],
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

const clubSlice = createSlice({
  name: 'club',
  initialState,
  reducers: {
    fetchClubs(state, action: PayloadAction<PaginationRequest>) {
      state.loading = true;
    },
    fetchClub(state) {
      state.loading = true;
    },
    fetchClubSuccess(state, action: PayloadAction<Response<Club>>) {
      state.loading = false;
      state.response = action.payload;
    },
    fetchStoresSuccess(state, action: PayloadAction<Store[]>) {
      state.loading = false;
      state.storesInGz = action.payload;
    },
    fetchStoreError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
    fetchStoreType(state) {},
    fetchBrandType(state) {},
    fetchProvince(state) {},
    fetchBuilding(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchDistrictByProvince(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchWardByDistrict(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchCampusByWard(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchBuildingByCampus(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchStoreTypeSuccess(state, action: PayloadAction<StoreType[]>) {
      state.storeTypes = action.payload;
    },
    fetchBrandTypeSuccess(state, action: PayloadAction<BrandType[]>) {
      state.brandTypes = action.payload;
    },
    fetchBuildingSuccess(state, action: PayloadAction<Building>) {
      state.building = action.payload;
    },
    fetchProvinceSuccess(state, action: PayloadAction<Province[]>) {
      state.provinces = action.payload;
    },
    fetchDistrictByProvinceSuccess(state, action: PayloadAction<District[]>) {
      state.districtsByProvince = action.payload;
    },
    fetchWardByDistrictSuccess(state, action: PayloadAction<Ward[]>) {
      state.wardsByDistrict = action.payload;
    },
    fetchCampusByWardSuccess(state, action: PayloadAction<Campus[]>) {
      state.campusesByWard = action.payload;
    },
    fetchBuildingByCampusSuccess(state, action: PayloadAction<Building[]>) {
      state.buildingsByCampus = action.payload;
    },
    fetchStoreTypeError(state) {},
    fetchBrandTypeError(state) {},
    fetchProvinceError(state) {},
    fetchBuildingError(state) {},
    fetchDistrictByProvinceError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
    fetchWardByDistrictError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
    fetchCampusByWardError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
    fetchBuildingByCampusError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
    setFilter(state, action: PayloadAction<PaginationRequest>) {
      state.filter = action.payload;
    },
    setFilterWithDebounce(state, action: PayloadAction<PaginationRequest>) {},
    fetchStoreTemplates(state, action: PayloadAction<PaginationRequest>) {
      state.loading = true;
    },
    fetchStoreTemplateSuccess(state, action: PayloadAction<Response<Template>>) {
      state.loading = false;
      state.templates = action.payload;
    },
    fetchStoreTemplateError(state) {
      state.loading = false;
      toast.error(i18n.t('common.errorText'));
    },
    setFilterTemplate(state, action: PayloadAction<PaginationRequest>) {
      state.filterTemplate = action.payload;
    },
    setFilterWithDebounceTemplate(state, action: PayloadAction<PaginationRequest>) {},
    // store in gz
    fetchStoresInGz(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchStoresInGzSuccess(state, action: PayloadAction<Store[]>) {
      state.loading = false;
      state.storesInGz = action.payload;
    },
    fetchStoresInGzError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
    // store empty trade zone
    fetchStoresEmptyTz(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchStoresEmptyTzSuccess(state, action: PayloadAction<Store[]>) {
      state.loading = false;
      state.storesEmptyTz = action.payload;
    },
    fetchStoresEmptyTzError(state, action: PayloadAction<string>) {
      state.loading = false;
    },
  },
});
// actions
export const clubActions = clubSlice.actions;
// selector
export const selectStoreResponse = (state: RootState) => state.stores.storesInGz;
export const selectStoresResponse = (state: RootState) => state.stores.response;
export const selectLoading = (state: RootState) => state.stores.loading;
export const selectFilter = (state: RootState) => state.stores.filter;
export const selectFilterTemplate = (state: RootState) => state.stores.filterTemplate;
export const selectStoreType = (state: RootState) => state.stores.storeTypes;
export const selectBrandType = (state: RootState) => state.stores.brandTypes;
export const selectTemplate = (state: RootState) => state.stores.templates;
export const selectStoreTypeOptions = createSelector(selectStoreType, (storeTypes) =>
  storeTypes?.map((storeType) => ({
    name: storeType.name,
    id: storeType.id,
  }))
);
export const selectBrandTypeOptions = createSelector(selectBrandType, (brandTypes) =>
  brandTypes?.map((brandType) => ({
    name: brandType?.name,
    id: brandType?.id,
  }))
);

export const selectBuilding = (state: RootState) => state.stores.building;

export const selectTemplatesOptions = createSelector(selectTemplate, (templates) =>
  templates?.results?.map((template) => ({
    name: template.name,
    id: template.id,
  }))
);
export const selectStoresOptions = createSelector(selectStoresResponse, (stores) =>
  stores?.results?.map((store) => ({
    name: store.name,
    id: store.id,
  }))
);
// stores in gz
export const selectStoreInGz = (state: RootState) => state.stores.storesInGz;
export const selectStoreInGzOptions = createSelector(selectStoreInGz, (stores) =>
  stores?.map((store) => ({
    name: store.name,
    id: store.id,
  }))
);
// store empty trade zone
export const selectStoreEmptyTz = (state: RootState) => state.stores.storesEmptyTz;
export const selectStoreEmptyTzOptions = createSelector(selectStoreEmptyTz, (stores) =>
  stores?.map((store) => ({
    name: store.name,
    id: store.id,
  }))
);

export const selectProvinces = (state: RootState) => state.stores.provinces;
export const selectProvincesOptions = createSelector(selectProvinces, (provinces) =>
  provinces?.map((province) => ({
    name: province.name,
    id: province.id,
  }))
);

export const selectDistricts = (state: RootState) => state.stores.districtsByProvince;
export const selectDistrictsOptions = createSelector(selectDistricts, (districts) =>
  districts?.map((district) => ({
    name: district.name,
    id: district.id,
  }))
);

export const selectWards = (state: RootState) => state.stores.wardsByDistrict;
export const selectWardsOptions = createSelector(selectWards, (wards) =>
  wards?.map((ward) => ({
    name: ward.name,
    id: ward.id,
  }))
);

export const selectCampuses = (state: RootState) => state.stores.campusesByWard;
export const selectCampusesOptions = createSelector(selectCampuses, (campuses) =>
  campuses?.map((campus) => ({
    name: campus.name,
    id: campus.id,
  }))
);

export const selectBuildings = (state: RootState) => state.stores.buildingsByCampus;
export const selectBuildingsOptions = createSelector(selectBuildings, (buildings) =>
  buildings?.map((building) => ({
    name: building.name,
    id: building.id,
  }))
);

// reducers
const storeReducer = clubSlice.reducer;
export default storeReducer;
