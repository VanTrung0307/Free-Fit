import { Grid, Typography } from '@mui/material';
import { useAppSelector } from 'app/hooks';
import SelectMUI from 'components/material-ui/SelectMUI';
import { selectTeamsOptions } from 'features/team/teamSlice';
import { AgentPagingRequest, GetStatusMap } from 'models';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

type TrackingFilterProps = {
  filter: AgentPagingRequest;
  onChange?: (newFilter: AgentPagingRequest) => void;
};

export default function TrackingFilter({ filter, onChange }: TrackingFilterProps) {
  const { t } = useTranslation();
  const { statusFilterAgent } = GetStatusMap();

  const teamOptions = useAppSelector(selectTeamsOptions);
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
      <Grid item xs={12} md={8} lg={8}>
        <Typography variant="h6" gutterBottom marginBottom={1} marginLeft={2} marginTop={1}>
          {t('agent.list')}
        </Typography>
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
