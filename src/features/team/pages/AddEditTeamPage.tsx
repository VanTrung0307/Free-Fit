import { Box, Container, Grid } from '@mui/material';
import assetApi from 'api/assetApi';
import teamApi from 'api/teamApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import { poiBrandActions as assetActions, selectFilter } from 'features/pois-brand/poiBrandSlice';
import useSettings from 'hooks/useSettings';
import { Team } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { getCurrentUser } from 'utils/common';
import TeamForm from '../components/TeamForm';

export default function AddEditTeamPage() {
  const { teamId } = useParams();
  const isEdit = Boolean(teamId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [team, setTeam] = useState<Team>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  const user = getCurrentUser();
  useEffect(() => {
    if (!teamId) return;

    // IFFE
    (async () => {
      try {
        const data: Team = await teamApi.getById(teamId);
        setTeam(data);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, [teamId]);
  const handelStoreFormSubmit = async (formValues: Team) => {
    if (!isEdit) {
      try {
        await teamApi.add(formValues);
        enqueueSnackbar(`${formValues?.name} ${t('team.addSuccess')}`, { variant: 'success' });
        const newFilter = { ...filter };
        dispatch(assetActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.team.root);
      } catch (error) {
        enqueueSnackbar(`${formValues?.name} ${t('common.errorText')}`, { variant: 'error' });
      }
    } else {
      try {
        await teamApi.update(teamId, formValues);
        enqueueSnackbar(
          `${t('team.updateSuccessStart') + formValues.name} ${t('team.updateSuccessEnd')}`,
          { variant: 'success' }
        );
        const newFilter = { ...filter };
        dispatch(assetActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.team.root);
      } catch (error) {
        enqueueSnackbar(`${formValues?.name} ${t('common.errorText')}`, { variant: 'error' });
      }
    }
  };
  const initialValues: Team = {
    name: '',
    brandId: user?.brandId,
    ...team,
  } as Team;
  return (
    <Page title={isEdit ? t('team.editTitle') : t('team.addTitle')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isEdit ? t('team.editTitle') : t('team.addTitle')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('team.list'), href: PATH_DASHBOARD.team.root },
            {
              name: isEdit ? team?.name || '' : t('team.addTitle'),
            },
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              {(!isEdit || Boolean(team)) && (
                <TeamForm
                  initialValue={initialValues}
                  onSubmit={handelStoreFormSubmit}
                  isEdit={isEdit}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
