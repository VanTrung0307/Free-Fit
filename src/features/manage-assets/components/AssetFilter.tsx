import searchFill from '@iconify/icons-eva/search-fill';
import { Icon } from '@iconify/react';
import { Box, Grid, InputAdornment, OutlinedInput } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import { useAppSelector } from 'app/hooks';
import SelectMUI from 'components/material-ui/SelectMUI';
import { selectStoresOptions } from 'features/store-management/storeSlice';
import { AssetPagingRequest, GetAssetType } from 'models';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

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

type AssetFilterProps = {
  filter: AssetPagingRequest;
  onChange?: (newFilter: AssetPagingRequest) => void;
  onSearchChange?: (newFilter: AssetPagingRequest) => void;
};

export default function AssetFilter({ filter, onChange, onSearchChange }: AssetFilterProps) {
  const { t } = useTranslation();
  const { typeAssetFilter } = GetAssetType();

  const storeOptions = useAppSelector(selectStoresOptions);

  const handelSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onSearchChange) return;
    const newFilter = {
      ...filter,
      keySearch: e.target.value === '' ? undefined : e.target.value,
    };
    onSearchChange(newFilter);
  };
  const handelStoreFilterChange = (selectedId: number) => {
    if (!onChange) return;
    const newFilter: AssetPagingRequest = {
      ...filter,
      storeId: selectedId,
    };
    onChange(newFilter);
  };
  const handelAssetTypeChange = (selectedId: number) => {
    if (!onChange) return;
    const newFilter: AssetPagingRequest = {
      ...filter,
      typeAsset: selectedId,
    };
    onChange(newFilter);
  };
  return (
    <Grid container spacing={2} padding={1}>
      <Grid item xs={12} md={3}>
        <SearchStyle
          size="small"
          onChange={handelSearchChange}
          placeholder={t('asset.search')}
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
          label={t('store.storeName')}
          labelId="filterByStoreName"
          options={storeOptions}
          onChange={handelStoreFilterChange}
          selected={filter.storeId}
        />
      </Grid>
      <Grid item xs={6} md={2}>
        <SelectMUI
          isAll={true}
          label={t('asset.type')}
          labelId="filterByType"
          options={typeAssetFilter}
          onChange={handelAssetTypeChange}
          selected={filter.typeAsset}
        />
      </Grid>
    </Grid>
  );
}
