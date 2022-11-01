import { Box, Container, Grid } from '@mui/material';
import agentApi from 'api/agentApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import { poiBrandActions as assetActions, selectFilter } from 'features/pois-brand/poiBrandSlice';
import useSettings from 'hooks/useSettings';
import { Agent } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import AgentForm from '../components/AgentForm';

export default function AddEditAgentPage() {
  const { agentId } = useParams();
  const isEdit = Boolean(agentId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [agent, setAgent] = useState<Agent>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  useEffect(() => {
    if (!agentId) return;

    // IFFE
    (async () => {
      try {
        const data: Agent = await agentApi.getById(agentId);
        setAgent(data);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, [agentId]);
  const handelAgentFormSubmit = async (formValues: Agent) => {
    if (!isEdit) {
      try {
        await agentApi.add(formValues).catch((err) => {
          if (err.response.status === 409) {
            enqueueSnackbar(t('common.errorUsername'), { variant: 'error' });
          }
          throw err;
        });
        enqueueSnackbar(`${formValues?.username} ${t('agent.addSuccess')}`, { variant: 'success' });
        const newFilter = { ...filter };
        dispatch(assetActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.agent.root);
      } catch (error) {
        enqueueSnackbar(`${formValues?.username} ${t('common.errorText')}`, { variant: 'error' });
      }
    } else {
      try {
        await agentApi.update(agentId, formValues).catch((err) => {
          if (err.response.status === 409) {
            enqueueSnackbar(t('common.errorUsername'), { variant: 'error' });
          }
          throw err;
        });
        enqueueSnackbar(
          `${t('agent.updateSuccessStart') + formValues.username} ${t('agent.updateSuccessEnd')}`,
          { variant: 'success' }
        );
        const newFilter = { ...filter };
        dispatch(assetActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.agent.root);
      } catch (error) {
        enqueueSnackbar(`${formValues?.username} ${t('common.errorText')}`, { variant: 'error' });
      }
    }
  };
  const initialValues: Agent = {
    address: '',
    agentType: 1,
    color: '',
    email: '',
    firstName: '',
    image: '',
    lastName: '',
    licencePlate: '',
    password: '',
    status: '',
    phone: '',
    role: 2,
    teamId: 0,
    transportDescription: '',
    transportType: 0,
    username: '',
    ...agent,
  } as Agent;
  return (
    <Page title={isEdit ? t('agent.titleEdit') : t('agent.titleAdd')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isEdit ? t('agent.titleEdit') : t('agent.titleAdd')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('agent.list'), href: PATH_DASHBOARD.agent.root },
            {
              name: isEdit ? agent?.username || '' : t('agent.titleAdd'),
            },
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              {(!isEdit || Boolean(agent)) && (
                <AgentForm
                  initialValue={initialValues}
                  onSubmit={handelAgentFormSubmit}
                  isEdit={isEdit}
                  isView={false}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
