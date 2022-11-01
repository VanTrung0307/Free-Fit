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
import poiApi from 'api/poiApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useTable } from 'components/common';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
import { adminLevelActions } from 'features/admin-level/adminLevelSlice';
import { poiActions } from 'features/pois/poiSlice';
// hooks
import useSettings from 'hooks/useSettings';
import { GetStatusMap, Poi, PoiPagingRequest } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import PoiBrandFilter from '../components/PoiBrandFilter';
import { poiBrandActions, selectFilter, selectLoading, selectPoiBrandList } from '../poiBrandSlice';

// ----------------------------------------------------------------------

export default function PoiBrandList() {
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const loading = useAppSelector(selectLoading);
  const rs = useAppSelector(selectPoiBrandList);
  const { statusMap } = GetStatusMap();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [poiBrandSelected, setPoiBrandSelected] = useState<Poi>();

  // effect
  useEffect(() => {
    dispatch(poiActions.fetchPoiTypeList());
    dispatch(adminLevelActions.fetchAdminLevelData());
  }, [dispatch]);
  useEffect(() => {
    dispatch(poiBrandActions.fetchPoiBrandList(filter));
  }, [dispatch, filter]);
  // functions
  const onPageChange = (page: number) => {
    dispatch(
      poiBrandActions.setFilter({
        ...filter,
        page: page + 1,
      })
    );
  };
  const onRowPerPageChange = (perPage: number) => {
    dispatch(
      poiBrandActions.setFilter({
        ...filter,
        pageSize: perPage,
      })
    );
  };
  const onSortChange = (colName: string, sortType: number) => {
    dispatch(
      poiBrandActions.setFilter({
        ...filter,
        colName,
        sortType,
      })
    );
  };
  const handelSearchDebounce = (newFilter: PoiPagingRequest) => {
    dispatch(poiBrandActions.setFilterWithDebounce(newFilter));
  };
  const handelFilterChange = (newFilter: PoiPagingRequest) => {
    dispatch(poiBrandActions.setFilterWithDebounce(newFilter));
  };
  // header
  const { t } = useTranslation();

  const headCells = [
    { id: 'no', label: '#', disableSorting: true },
    { id: 'poiName', label: t('poi.poiName'), disableSorting: true },
    { id: 'brandPoiCode', label: t('poi.brandPoiCode'), disableSorting: true },
    { id: 'alias', label: t('poi.alias'), disableSorting: true },
    { id: 'poiType', label: t('poi.poiType'), disableSorting: true },
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
  const handelDetailsClick = (poi: Poi) => {
    navigate(`${PATH_DASHBOARD.poiBrand.edit}/${poi.id}`);
  };
  const handelRemoveClick = (poi: Poi) => {
    setPoiBrandSelected(poi);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    try {
      await poiApi.remove(poiBrandSelected?.id || 0);
      const newFilter = { ...filter };
      dispatch(poiBrandActions.setFilter(newFilter));
      enqueueSnackbar(`${poiBrandSelected?.name} ${t('store.deleteSuccess')}`, {
        variant: 'success',
      });

      setPoiBrandSelected(undefined);
      setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(`${poiBrandSelected?.name} ${t('common.errorText')}`, { variant: 'error' });
    }
  };

  return (
    <Page title={t('poi.poiBrand')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('poi.poiBrandList')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('poi.poiBrandList') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.poiBrand.add}
              startIcon={<Icon icon={plusFill} />}
            >
              {t('poi.addPoiBrandTitle')}
            </Button>
          }
        />

        <Card>
          <PoiBrandFilter
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

                  {rs.results?.map((e, idx) => (
                    <TableRow key={e.id}>
                      <TableCell width={80} component="th" scope="row" padding="none">
                        {idx + 1}
                      </TableCell>
                      <TableCell align="left">{e.name}</TableCell>
                      <TableCell align="left">{e.brandPoiCode}</TableCell>
                      <TableCell align="left">{e.alias}</TableCell>
                      <TableCell align="left">{e.poiTypeName}</TableCell>
                      <TableCell>
                        <Box color={statusMap[e.statusPoiBrand].color} fontWeight="bold">
                          {statusMap[e.statusPoiBrand].name}
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
                            <span>
                              <IconButton
                                color="error"
                                onClick={() => handelRemoveClick(e)}
                                size="large"
                              >
                                <Icon icon={trash2Outline} />
                              </IconButton>
                            </span>
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
            {`Poi: ${poiBrandSelected?.name} ${t('store.removeTitleEnd')}`}
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
