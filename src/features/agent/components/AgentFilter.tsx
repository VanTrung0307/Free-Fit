import searchFill from '@iconify/icons-eva/search-fill';
import { Icon } from '@iconify/react';
import { Box, Grid, InputAdornment, OutlinedInput } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import { useAppSelector } from 'app/hooks';
import SelectMUI from 'components/material-ui/SelectMUI';
import { selectTeamsOptions } from 'features/team/teamSlice';
import { AgentPagingRequest, GetStatusMap } from 'models';
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

type AgentFilterProps = {
  filter: AgentPagingRequest;
  onChange?: (newFilter: AgentPagingRequest) => void;
  onSearchChange?: (newFilter: AgentPagingRequest) => void;
};

export default function AgentFilter({ filter, onChange, onSearchChange }: AgentFilterProps) {
  const { t } = useTranslation();
  const { statusFilterAgent } = GetStatusMap();

  const teamOptions = useAppSelector(selectTeamsOptions);

  const handelSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onSearchChange) return;
    const newFilter = {
      ...filter,
      keySearch: e.target.value === '' ? undefined : e.target.value,
    };
    onSearchChange(newFilter);
  };
  const handelTeamFilterChange = (selectedId: number) => {
    if (!onChange) return;
    const newFilter: AgentPagingRequest = {
      ...filter,
      teamId: selectedId,
    };
    onChange(newFilter);
  };
  const handelStatusChange = (selectedId: number) => {
    if (!onChange) return;
    const newFilter: AgentPagingRequest = {
      ...filter,
      status: selectedId,
    };
    onChange(newFilter);
  };
  return (
    <Grid container spacing={2} padding={1}>
      <Grid item xs={12} md={3} lg={3}>
        <SearchStyle
          onChange={handelSearchChange}
          placeholder={t('agent.search')}
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
          label={t('team.name')}
          labelId="filterByTeamName"
          options={teamOptions}
          onChange={handelTeamFilterChange}
          selected={filter.teamId}
        />
      </Grid>
      <Grid item xs={6} md={2} lg={2}>
        <SelectMUI
          isAll={true}
          label={t('common.status')}
          labelId="filterByStatus"
          options={statusFilterAgent}
          onChange={handelStatusChange}
          selected={filter.status}
        />
      </Grid>
    </Grid>
  );
}
