import searchFill from '@iconify/icons-eva/search-fill';
import { Icon } from '@iconify/react';
import {
  Box,
  InputAdornment,
  OutlinedInput,
  Toolbar,
  Autocomplete,
  TextField,
} from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import { PaginationRequest } from 'models';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 200,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

type StoreFilterProps = {
  filter: PaginationRequest;
  onChange?: (newFilter: PaginationRequest) => void;
  onSearchChange?: (newFilter: PaginationRequest) => void;
  data?: any;
  searchBy?: string;
};

export default function SegmentFilter({ filter, onChange, onSearchChange }: StoreFilterProps) {
  const { t } = useTranslation();
  const handelSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onSearchChange) return;
    const newFilter = {
      ...filter,
      keySearch: e.target.value === '' ? undefined : e.target.value,
    };
    onSearchChange(newFilter);
  };

  return (
    <RootStyle>
      <SearchStyle
        onChange={handelSearchChange}
        placeholder={t('segment.search')}
        startAdornment={
          <InputAdornment position="start">
            <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
      />
    </RootStyle>
  );
}

export function StoreTypeAutoCompleteFilter({
  filter,
  onChange,
  onSearchChange,
  data,
  searchBy,
}: StoreFilterProps) {
  const handelSearchChange = (value, by) => {
    if (!onSearchChange) return;
    const newFilter = {
      ...filter,
      keySearch: value === '' ? undefined : value,
      searchBy: value === '' ? undefined : by,
    };
    onSearchChange(newFilter);
  };

  return (
    <RootStyle>
      <Autocomplete
        disablePortal
        id="parentStoreTypeId"
        options={data}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Loại cửa hàng gốc" />}
        onChange={(event, newValue: any) => {
          handelSearchChange(newValue != null ? newValue.value : '', searchBy);
        }}
      />
    </RootStyle>
  );
}
