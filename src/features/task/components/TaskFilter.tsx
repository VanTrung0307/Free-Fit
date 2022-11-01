import searchFill from '@iconify/icons-eva/search-fill';
import { Icon } from '@iconify/react';
import { Box, Grid, InputAdornment, OutlinedInput } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import SelectMUI from 'components/material-ui/SelectMUI';
import { TaskPagingRequest } from 'models';
import { GetTaskTypeMap } from 'models/dto/taskStatus';
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

type TaskFilterProps = {
  filter: TaskPagingRequest;
  onChange?: (newFilter: TaskPagingRequest) => void;
  onSearchChange?: (newFilter: TaskPagingRequest) => void;
};

export default function TaskFilter({ filter, onChange, onSearchChange }: TaskFilterProps) {
  const { t } = useTranslation();
  const { taskTypeFilter } = GetTaskTypeMap();

  const handelSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onSearchChange) return;
    const newFilter = {
      ...filter,
      keySearch: e.target.value === '' ? undefined : e.target.value,
    };
    onSearchChange(newFilter);
  };
  const handelStatusChange = (selectedId: number) => {
    if (!onChange) return;
    const newFilter: TaskPagingRequest = {
      ...filter,
      status: selectedId,
    };
    onChange(newFilter);
  };
  return (
    <Grid container spacing={2} padding={1}>
      <Grid item xs={6} md={10}>
        <SearchStyle
          onChange={handelSearchChange}
          placeholder={t('store.search')}
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
          label={t('common.status')}
          labelId="filterByStatus"
          options={taskTypeFilter}
          onChange={handelStatusChange}
          selected={filter.status}
        />
      </Grid>
    </Grid>
  );
}
