import editFill from '@iconify/icons-eva/edit-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { Icon } from '@iconify/react';
// material
import {
  Avatar,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
// material
import { Box } from '@mui/system';
import agentApi from 'api/agentApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useTable } from 'components/common';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
import { teamActions } from 'features/team/teamSlice';
// hooks
import useSettings from 'hooks/useSettings';
import { Agent, AgentPagingRequest, GetStatusMap } from 'models';
import { GetAgentTypeMap } from 'models/dto/agentType';
import { GetTransportTypeMap } from 'models/dto/transportType';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import { agentActions, selectAgentList, selectFilter, selectLoading } from '../agentSlice';
import AgentFilter from '../components/AgentFilter';
import AgentForm from '../components/AgentForm';

// ----------------------------------------------------------------------

export default function AgentList() {
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const loading = useAppSelector(selectLoading);
  const rs = useAppSelector(selectAgentList);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [agent, setAgent] = useState<Agent>();
  const [popupOpen, setPopupOpen] = useState(false);
  const { t } = useTranslation();
  const { agentTypeMap } = GetAgentTypeMap();
  const { transportTypeMap } = GetTransportTypeMap();
  const { statusMapAgent } = GetStatusMap();
  // effect
  useEffect(() => {
    dispatch(agentActions.fetchAgentList(filter));
  }, [dispatch, filter]);
  useEffect(() => {
    dispatch(teamActions.fetchTeamList({}));
  }, [dispatch]);
  // functions
  const handelFilterChange = (newFilter: AgentPagingRequest) => {
    dispatch(agentActions.setFilter(newFilter));
  };
  const onPageChange = (page: number) => {
    dispatch(
      agentActions.setFilter({
        ...filter,
        page: page + 1,
      })
    );
  };
  const onRowPerPageChange = (perPage: number) => {
    dispatch(
      agentActions.setFilter({
        ...filter,
        pageSize: perPage,
      })
    );
  };
  const onSortChange = (colName: string, sortType: number) => {
    dispatch(
      agentActions.setFilter({
        ...filter,
        colName,
        sortType,
      })
    );
  };
  // header
  const headCells = [
    { id: '#', label: '#', disableSorting: true },
    { id: 'username', label: t('login.username') },
    { id: 'agentType', label: t('agent.agentType') },
    { id: 'transportType', label: t('agent.transportType') },
    { id: 'teamName', label: t('team.name'), disableSorting: true },
    { id: 'status', label: t('common.status'), disableSorting: true },
    { id: 'action', label: t('common.actions'), disableSorting: true, align: 'center' },
  ];
  const { TblHead, TblPagination } = useTable({
    rs,
    headCells,
    filter,
    onPageChange,
    onRowPerPageChange,
    onSortChange,
  });
  const handelDetailsClick = (tzVersion: Agent) => {
    setAgent(tzVersion);
    setPopupOpen(true);
  };
  const handelRemoveClick = (asset: Agent) => {
    setAgent(asset);
    setConfirmDelete(true);
  };
  const handelSearchDebounce = (newFilter: AgentPagingRequest) => {
    dispatch(agentActions.setFilterWithDebounce(newFilter));
  };
  const handelConfirmRemoveClick = async () => {
    try {
      await agentApi.remove(Number(agent?.id) || 0);
      const newFilter = { ...filter };
      dispatch(agentActions.setFilter(newFilter));
      enqueueSnackbar(`${agent?.username} ${t('store.deleteSuccess')}`, {
        variant: 'success',
      });
      setAgent(undefined);
      setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(`${agent?.username} ${t('common.errorText')}`, { variant: 'error' });
    }
  };

  return (
    <Page title={t('agent.list')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('agent.list')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('agent.list') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.agent.add}
              startIcon={<Icon icon={plusFill} width={20} height={20} />}
            >
              {t('agent.titleAdd')}
            </Button>
          }
        />

        <Card>
          <AgentFilter
            filter={filter}
            onSearchChange={handelSearchDebounce}
            onChange={handelFilterChange}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table size="small">
                <TblHead />
                <TableBody>
                  {true && (
                    <TableRow style={{ height: 1 }}>
                      <TableCell colSpan={20} style={{ paddingBottom: '0px', paddingTop: '0px' }}>
                        <Box>{loading && <LinearProgress color="primary" />}</Box>
                      </TableCell>
                    </TableRow>
                  )}

                  {rs?.results?.map((e, idx) => (
                    <TableRow key={e.id}>
                      <TableCell align="left">{idx + 1}</TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt="error" src={e.image} />
                          <Typography variant="subtitle2" noWrap>
                            {e.username}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{agentTypeMap[e.agentType]?.name || ''}</TableCell>
                      <TableCell align="left">
                        {transportTypeMap[e.transportType]?.name || ''}
                      </TableCell>
                      <TableCell align="left">{e.teamName}</TableCell>
                      <TableCell align="left">
                        <Box color={statusMapAgent[e.status].color} fontWeight="bold">
                          {statusMapAgent[e.status]?.name || ''}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box style={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip key={`btnDetails-${e.id}`} title={t('common.details') || ''}>
                            <IconButton
                              color="info"
                              onClick={() => handelDetailsClick(e)}
                              size="large"
                            >
                              <Icon icon={editFill} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip key={`btnDelete-${e.id}`} title={t('common.remove') || ''}>
                            <IconButton
                              color="error"
                              onClick={() => handelRemoveClick(e)}
                              size="large"
                            >
                              <Icon icon={trash2Outline} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {rs.results?.length === 0 && (
                    <TableRow style={{ height: 53 * 10 }}>
                      <TableCell colSpan={20}>
                        <Typography gutterBottom align="center" variant="subtitle1">
                          {t('common.notFound')}
                        </Typography>
                        <Typography variant="body2" align="center">
                          {t('common.searchNotFound')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <TblPagination />
        </Card>
      </Container>
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>{t('common.titleConfirm')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`${t('common.agent')}: ${agent?.username} ${t('store.removeTitleEnd')}`}
            <br />
            {t('common.canRevert')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setConfirmDelete(false)}>
            {t('content.btnClose')}
          </Button>
          <Button onClick={handelConfirmRemoveClick} autoFocus>
            {t('common.confirmBtn')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={popupOpen} onClose={() => setPopupOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{t('common.details')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {agent !== undefined && <AgentForm initialValue={agent} isEdit={false} isView={true} />}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setPopupOpen(false)}>
            {t('content.btnClose')}
          </Button>
          <Button
            onClick={() => {
              navigate(`${PATH_DASHBOARD.agent.edit}/${agent?.id}`);
            }}
            autoFocus
          >
            {t('common.editInfo')}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
