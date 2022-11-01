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
import brandApi from 'api/brandApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useTable } from 'components/common';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
// hooks
import useSettings from 'hooks/useSettings';
import { PaginationRequest, Brand } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import BrandFilter from '../components/BrandFilter';
import { selectFilter, selectLoading, selectBrandsResponse, brandActions } from '../brandSlice';

// ----------------------------------------------------------------------

export default function BrandList() {
  const { themeStretch } = useSettings();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [brandSelected, setBrandSelected] = useState<Brand>();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const rs = useAppSelector(selectBrandsResponse);
  const loading = useAppSelector(selectLoading);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // effect
  useEffect(() => {
    dispatch(brandActions.fetchBrands(filter));
  }, [dispatch, filter]);

  const onPageChange = (page: number) => {
    dispatch(
      brandActions.setFilter({
        ...filter,
        page: page + 1,
      })
    );
  };
  const onRowPerPageChange = (perPage: number) => {
    dispatch(
      brandActions.setFilter({
        ...filter,
        pageSize: perPage,
      })
    );
  };
  const onSortChange = (colName: string, sortType: number) => {
    dispatch(
      brandActions.setFilter({
        ...filter,
        colName,
        sortType,
      })
    );
  };
  const handelSearchDebounce = (newFilter: PaginationRequest) => {
    dispatch(brandActions.setFilterWithDebounce(newFilter));
  };

  const handelRemoveClick = (brand: Brand) => {
    setBrandSelected(brand);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    try {
      await brandApi.remove(brandSelected?.id || 0);
      const newFilter = { ...filter };
      dispatch(brandActions.setFilter(newFilter));
      enqueueSnackbar(`${brandSelected?.name} ${t('brand.deleteSuccess')}`, { variant: 'success' });

      setBrandSelected(undefined);
      setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(`${brandSelected?.name} ${t('common.errorText')}`, { variant: 'error' });
    }
  };

  // header
  const { t } = useTranslation();
  const headCells = [
    { id: 'no', label: '#' },
    { id: 'brandName', label: t('brand.brandName') },
    { id: 'segmentName', label: t('brand.segmentName') },
    { id: 'actions', label: t('common.actions'), disableSorting: true, align: 'center' },
  ];

  const { TblHead, TblPagination } = useTable({
    rs,
    headCells,
    filter,
    onPageChange,
    onRowPerPageChange,
    onSortChange,
  });
  const handelDetailsClick = (brand: Brand) => {
    navigate(`${PATH_DASHBOARD.brand.details}/${brand.id}`);
  };
  return (
    <Page title={t('brand.title')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('brand.listBrand')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('brand.listBrand') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.brand.add}
              startIcon={<Icon icon={plusFill} />}
            >
              {t('brand.btnAdd')}
            </Button>
          }
        />

        <Card>
          <BrandFilter filter={filter} onSearchChange={handelSearchDebounce} />

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
                      <TableCell align="left">{e.segmentName}</TableCell>
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
                  {rs.results.length === 0 && (
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
            {`${t('store.removeTitleStart') + brandSelected?.name} ${t('store.removeTitleEnd')}`}
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
