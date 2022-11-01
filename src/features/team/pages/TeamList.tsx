import editFill from '@iconify/icons-eva/edit-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { Icon } from '@iconify/react';
// material
import {
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
import teamApi from 'api/teamApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useTable } from 'components/common';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
// hooks
import useSettings from 'hooks/useSettings';
import { PaginationRequest, Team } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import TeamFilter from '../components/TeamFilter';
import { selectFilter, selectLoading, selectTeamList, teamActions } from '../teamSlice';
// ----------------------------------------------------------------------

export default function TeamList() {
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const loading = useAppSelector(selectLoading);
  const rs = useAppSelector(selectTeamList);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [teamSelected, setTeamSelected] = useState<Team>();

  // effect
  useEffect(() => {
    dispatch(teamActions.fetchTeamList(filter));
  }, [dispatch, filter]);
  // functions
  const onPageChange = (page: number) => {
    dispatch(
      teamActions.setFilter({
        ...filter,
        page: page + 1,
      })
    );
  };
  const onRowPerPageChange = (perPage: number) => {
    dispatch(
      teamActions.setFilter({
        ...filter,
        pageSize: perPage,
      })
    );
  };
  const onSortChange = (colName: string, sortType: number) => {
    dispatch(
      teamActions.setFilter({
        ...filter,
        colName,
        sortType,
      })
    );
  };
  const handelSearchDebounce = (newFilter: PaginationRequest) => {
    dispatch(teamActions.setFilterWithDebounce(newFilter));
  };
  // header
  const { t } = useTranslation();

  const headCells = [
    { id: 'id', label: '#', align: 'center' },
    { id: 'name', label: t('team.name'), align: 'left' },
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
  const handelDetailsClick = (team: Team) => {
    navigate(`${PATH_DASHBOARD.team.edit}/${team.id}`);
  };
  const handelRemoveClick = (team: Team) => {
    setTeamSelected(team);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    try {
      await teamApi.remove(Number(teamSelected?.id) || 0);
      const newFilter = { ...filter };
      dispatch(teamActions.setFilter(newFilter));
      enqueueSnackbar(`${teamSelected?.name} ${t('store.deleteSuccess')}`, {
        variant: 'success',
      });

      setTeamSelected(undefined);
      setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(`${teamSelected?.name} ${t('common.errorText')}`, { variant: 'error' });
    }
  };

  return (
    <Page title={t('team.list')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('team.list')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('team.list') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.team.add}
              startIcon={<Icon icon={plusFill} />}
            >
              {t('team.addTitle')}
            </Button>
          }
        />

        <Card>
          <TeamFilter filter={filter} onSearchChange={handelSearchDebounce} />

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

                  {rs.results?.map((e, idx) => (
                    <TableRow key={e.id}>
                      <TableCell align="center" width={70}>
                        {idx + 1}
                      </TableCell>
                      <TableCell align="left">{e.name}</TableCell>
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
          <DialogContentText id="alert-dialog-description">
            {`${t('team.name')}: ${teamSelected?.name} ${t('store.removeTitleEnd')}`}
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
    </Page>
  );
}
