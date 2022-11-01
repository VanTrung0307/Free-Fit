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
import assetApi from 'api/assetApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useTable } from 'components/common';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
import { storeActions } from 'features/store-management/storeSlice';
// hooks
import useSettings from 'hooks/useSettings';
import { Asset, AssetPagingRequest, GetAssetType } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import { assetActions, selectAssetList, selectFilter, selectLoading } from '../assetSlice';
import AssetFilter from '../components/AssetFilter';
import AssetForm from '../components/AssetForm';

// ----------------------------------------------------------------------

export default function AssetList() {
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const loading = useAppSelector(selectLoading);
  const rs = useAppSelector(selectAssetList);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [assetSelected, setAssetSelected] = useState<Asset>();
  const { typeAssetMap } = GetAssetType();
  const [popupOpen, setPopupOpen] = useState(false);

  // effect
  useEffect(() => {
    dispatch(
      storeActions.fetchStores({
        page: undefined,
        colName: undefined,
        keySearch: undefined,
        pageSize: undefined,
        sortType: undefined,
      })
    );
  }, [dispatch, filter]);
  useEffect(() => {
    dispatch(assetActions.fetchAssetList(filter));
  }, [dispatch, filter]);
  // functions
  const onPageChange = (page: number) => {
    dispatch(
      assetActions.setFilter({
        ...filter,
        page: page + 1,
      })
    );
  };
  const onRowPerPageChange = (perPage: number) => {
    dispatch(
      assetActions.setFilter({
        ...filter,
        pageSize: perPage,
      })
    );
  };
  const onSortChange = (colName: string, sortType: number) => {
    dispatch(
      assetActions.setFilter({
        ...filter,
        colName,
        sortType,
      })
    );
  };
  const handelSearchDebounce = (newFilter: AssetPagingRequest) => {
    dispatch(assetActions.setFilterWithDebounce(newFilter));
  };
  const handelFilterChange = (newFilter: AssetPagingRequest) => {
    dispatch(assetActions.setFilter(newFilter));
  };
  // header
  const { t } = useTranslation();

  const headCells = [
    { id: 'id', label: '#', disableSorting: true },
    { id: 'name', label: t('asset.name') },
    { id: 'storeName', label: t('asset.storeName') },
    { id: 'type', label: t('asset.type') },
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
  const handelDetailsClick = (asset: Asset) => {
    setAssetSelected(asset);
    setPopupOpen(true);
    // navigate(`${PATH_DASHBOARD.asset.edit}/${asset.id}`);
  };
  const handelRemoveClick = (asset: Asset) => {
    setAssetSelected(asset);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    try {
      await assetApi.remove(Number(assetSelected?.id) || 0);
      const newFilter = { ...filter };
      dispatch(assetActions.setFilter(newFilter));
      enqueueSnackbar(`${assetSelected?.name} ${t('store.deleteSuccess')}`, {
        variant: 'success',
      });

      setAssetSelected(undefined);
      setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(`${assetSelected?.name} ${t('common.errorText')}`, { variant: 'error' });
    }
  };

  return (
    <Page title={t('asset.title')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('asset.list')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('asset.list') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.asset.add}
              startIcon={<Icon icon={plusFill} />}
            >
              {t('asset.btnAdd')}
            </Button>
          }
        />

        <Card>
          <AssetFilter
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
                      <TableCell width={70} align="left">
                        {idx + 1}
                      </TableCell>
                      <TableCell align="left">{e.name}</TableCell>

                      <TableCell align="left">{e.storeName}</TableCell>
                      <TableCell align="left">
                        <Box fontWeight="bold">{typeAssetMap[e.type].name}</Box>
                      </TableCell>
                      <TableCell width={250}>
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
            {`${t('content.asset')}: ${assetSelected?.name} ${t('store.removeTitleEnd')}`}
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
          <Box mt={2}>
            {assetSelected !== undefined && (
              <AssetForm initialValue={assetSelected} isEdit={false} isView={true} />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setPopupOpen(false)}>
            {t('content.btnClose')}
          </Button>
          <Button
            onClick={() => {
              navigate(`${PATH_DASHBOARD.asset.edit}/${assetSelected?.id}`);
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
