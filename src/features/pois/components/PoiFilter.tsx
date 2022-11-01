import searchFill from '@iconify/icons-eva/search-fill';
import { Icon } from '@iconify/react';
import { Box, Grid, InputAdornment, OutlinedInput } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import SelectMUI from 'components/material-ui/SelectMUI';
import {
  adminLevelActions,
  selectDistrictOptions,
  selectProvinceOptions,
  selectWardOptions,
} from 'features/admin-level/adminLevelSlice';
import { GetStatusMap, PoiPagingRequest } from 'models';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { selectPoiTypeList } from '../poiSlice';

// ----------------------------------------------------------------------

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: '100%',
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: '100%', boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

type PoiFilterProps = {
  filter: PoiPagingRequest;
  onChange?: (newFilter: PoiPagingRequest) => void;
  onSearchChange?: (newFilter: PoiPagingRequest) => void;
};

export default function PoiFilter({ filter, onChange, onSearchChange }: PoiFilterProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const poiTypes = useAppSelector(selectPoiTypeList);
  const { statusFilter } = GetStatusMap();
  const provinceOptions = useAppSelector(selectProvinceOptions);
  const districtOptions = useAppSelector(selectDistrictOptions);
  const wardOptions = useAppSelector(selectWardOptions);
  const handelSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onSearchChange) return;
    const newFilter = {
      ...filter,
      keySearch: e.target.value === '' ? undefined : e.target.value,
    };
    onSearchChange(newFilter);
  };
  const handleProvinceChange = (selectedId: number) => {
    dispatch(adminLevelActions.provinceChange(selectedId));
    if (!onChange) return;
    const newFilter: PoiPagingRequest = {
      ...filter,
      provinceId: selectedId,
    };
    onChange(newFilter);
  };
  const handleDistrictChange = (selectedId: number) => {
    dispatch(adminLevelActions.districtChange(selectedId));
    if (!onChange) return;
    const newFilter: PoiPagingRequest = {
      ...filter,
      districtId: selectedId,
    };
    onChange(newFilter);
  };
  const handelPoiTypeChange = (selectedId: number) => {
    if (!onChange) return;
    const newFilter: PoiPagingRequest = {
      ...filter,
      poiTypeId: selectedId,
    };
    onChange(newFilter);
  };
  const handelStatusChange = (selectedId: number) => {
    if (!onChange) return;
    const newFilter: PoiPagingRequest = {
      ...filter,
      status: selectedId,
    };
    onChange(newFilter);
  };
  const handelWardChange = (selectedId: number) => {
    if (!onChange) return;
    const newFilter: PoiPagingRequest = {
      ...filter,
      wardId: selectedId,
    };
    onChange(newFilter);
  };
  return (
    <Grid container spacing={2} padding={1}>
      <Grid item xs={6} md={2}>
        <SearchStyle
          onChange={handelSearchChange}
          placeholder={t('poi.search')}
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      </Grid>
      <Grid item xs={6} md={2}>
        <SelectMUI
          isAll={true}
          label={t('poi.poiType')}
          labelId="filterByPoiType"
          options={poiTypes}
          onChange={handelPoiTypeChange}
          selected={filter.poiTypeId}
        />
      </Grid>
      <Grid item xs={6} md={2}>
        <SelectMUI
          isAll={true}
          label={t('common.status')}
          labelId="filterByPoiStatus"
          options={statusFilter}
          onChange={handelStatusChange}
          selected={filter.status}
        />
      </Grid>
      <Grid item xs={6} md={2}>
        <SelectMUI
          isAll={true}
          label={t('adminLevel.province')}
          labelId="filterByProvince"
          options={provinceOptions}
          onChange={handleProvinceChange}
          selected={filter.provinceId}
        />
      </Grid>
      <Grid item xs={6} md={2}>
        <SelectMUI
          isAll={true}
          label={t('adminLevel.district')}
          labelId="filterByDistrict"
          options={districtOptions}
          onChange={handleDistrictChange}
          selected={filter.districtId}
        />
      </Grid>
      <Grid item xs={6} md={2}>
        <SelectMUI
          isAll={true}
          label={t('adminLevel.ward')}
          labelId="filterByWard"
          onChange={handelWardChange}
          selected={filter.wardId}
          options={wardOptions}
        />
      </Grid>
    </Grid>
  );
}
