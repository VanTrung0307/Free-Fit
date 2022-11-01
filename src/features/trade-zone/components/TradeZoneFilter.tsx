import searchFill from '@iconify/icons-eva/search-fill';
import { Icon } from '@iconify/react';
import { Box, Grid, InputAdornment, OutlinedInput } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import { useAppSelector } from 'app/hooks';
import SelectMUI from 'components/material-ui/SelectMUI';
import { selectGroupZoneOptions } from 'features/group-zone/groupZoneSlice';
import { selectTzVersionOptions } from 'features/trade-zone-version/tzVersionSlice';
import { PoiPagingRequest, TradeZonePagingRequest } from 'models';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { selectFilter } from '../tradeZoneSlice';

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

type TradeZoneFilterProps = {
  onChange?: (newFilter: PoiPagingRequest) => void;
  onSearchChange?: (newFilter: PoiPagingRequest) => void;
};

export default function TradeZoneFilter({ onChange, onSearchChange }: TradeZoneFilterProps) {
  const { t } = useTranslation();
  const groupZoneOptions = useAppSelector(selectGroupZoneOptions);
  const tzVersionOptions = useAppSelector(selectTzVersionOptions);
  const filter = useAppSelector(selectFilter);

  const handelSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onSearchChange) return;
    const newFilter = {
      ...filter,
      keySearch: e.target.value === '' ? undefined : e.target.value,
    };
    onSearchChange(newFilter);
  };
  const handelTzVersionChange = (selectedId: number) => {
    if (!onChange) return;
    const newFilter: TradeZonePagingRequest = {
      ...filter,
      tradeZoneVersionId: selectedId,
    };
    onChange(newFilter);
  };
  const handelGzChange = (selectedId: number) => {
    if (!onChange) return;
    const newFilter: TradeZonePagingRequest = {
      ...filter,
      groupZoneId: selectedId,
    };
    onChange(newFilter);
  };
  return (
    <Grid container spacing={2} padding={1}>
      <Grid item xs={12} md={3} lg={3}>
        <SearchStyle
          onChange={handelSearchChange}
          placeholder={t('tz.search')}
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      </Grid>
      <Grid item xs={6} md={2} lg={2}>
        <SelectMUI
          isAll={true}
          label={t('tz.tzVerName')}
          labelId="filterByTz"
          options={tzVersionOptions}
          onChange={handelTzVersionChange}
          selected={filter.tradeZoneVersionId}
        />
      </Grid>
      <Grid item xs={6} md={2} lg={2}>
        <SelectMUI
          isAll={true}
          label={t('groupZone.title')}
          labelId="filterByGZ"
          options={groupZoneOptions}
          onChange={handelGzChange}
          selected={filter.groupZoneId}
        />
      </Grid>
    </Grid>
  );
}
