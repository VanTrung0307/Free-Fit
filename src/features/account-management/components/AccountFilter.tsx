import searchFill from '@iconify/icons-eva/search-fill';
import { Icon } from '@iconify/react';
import { Box, InputAdornment, OutlinedInput, Toolbar } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import { PaginationRequest } from 'models';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 50,
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

type AccountFilterProps = {
  filter: PaginationRequest;
  onChange?: (newFilter: PaginationRequest) => void;
  onSearchChange?: (newFilter: PaginationRequest) => void;
};

export default function AccountFilter({ filter, onChange, onSearchChange }: AccountFilterProps) {
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
        placeholder={t('account.search')}
        startAdornment={
          <InputAdornment position="start">
            <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
      />
    </RootStyle>
  );
}
