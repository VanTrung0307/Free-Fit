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
  Grid,
} from '@mui/material';
// material
import { InputField } from 'components/form';
import SelectField from 'components/FormField/SelectField';
import { Box } from '@mui/system';
import storeTypeApi from 'api/storeTypeApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useTable } from 'components/common';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
// hooks
import useSettings from 'hooks/useSettings';
import { PaginationRequest, StoreType } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// redux
// routes
import { useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import Confirm from 'components/modal/Confirm';
import StoreTypeForm from '../components/StoreTypeForm';
import StoreTypeFilter, { StoreTypeAutoCompleteFilter } from '../components/StoreTypeFilter';
import {
  selectFilter,
  selectLoading,
  selectStoreTypesResponse,
  storeTypeActions,
  selectStoreTypeTypeOptions,
} from '../storeTypeSlice';

// ----------------------------------------------------------------------

export default function StoreTypeList() {
  const { storeTypeId } = useParams();
  const isEdit = Boolean(storeTypeId);
  const { themeStretch } = useSettings();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [storeTypeSelected, setStoreTypeSelected] = useState<StoreType>();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const rs = useAppSelector(selectStoreTypesResponse);
  const loading = useAppSelector(selectLoading);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const storeTypesOptions = useAppSelector(selectStoreTypeTypeOptions);
  const storeTypeOptions = storeTypesOptions.map((c) => ({ label: c.name, value: c.id }));

  // effect
  useEffect(() => {
    dispatch(storeTypeActions.fetchStoreTypes(filter));
    dispatch(storeTypeActions.fetchStoreTypeType());
  }, [dispatch, filter]);

  // useEffect(() => {
  //   if (isEdit === false) return;

  //   // IFFE
  //   (async () => {
  //     try {
  //       const data: StoreType = await storeTypeApi.getStoreById(storeId);
  //       data?.buildingId ? setBuildingId(data?.buildingId) : setBuildingId(0);
  //       let postLocation: string = '';
  //       if (data?.geom?.coordinates) {
  //         const detailsLocation: LatLngExpression = [
  //           data?.geom?.coordinates[1],
  //           data?.geom?.coordinates[0],
  //         ];

  //         postLocation = `${data?.geom?.coordinates[0]} ${data?.geom?.coordinates[1]}`;
  //         setLocation(detailsLocation);
  //       }
  //       const newValue: PostStore = {
  //         id: data?.id,
  //         address: data?.address || '',
  //         name: data?.name || '',
  //         imageUrl: data?.imageUrl || '',
  //         coordinateString: postLocation,
  //         storeCode: data?.storeCode || '',
  //         storeTypeId: data?.storeTypeId || 0,
  //         brandId: data?.brandId || 0,
  //         buildingId: buildingId || 0,
  //       };
  //       setStore(newValue);
  //       // eslint-disable-next-line no-empty
  //     } catch (error) {}
  //   })();
  // }, [storeId]);

  const onPageChange = (page: number) => {
    dispatch(
      storeTypeActions.setFilter({
        ...filter,
        page: page + 1,
      })
    );
  };
  const onRowPerPageChange = (perPage: number) => {
    dispatch(
      storeTypeActions.setFilter({
        ...filter,
        pageSize: perPage,
      })
    );
  };
  const onSortChange = (colName: string, sortType: number) => {
    dispatch(
      storeTypeActions.setFilter({
        ...filter,
        colName,
        sortType,
      })
    );
  };
  const handelSearchDebounce = (newFilter: PaginationRequest) => {
    dispatch(storeTypeActions.setFilterWithDebounce(newFilter));
  };

  const handelRemoveClick = (storeType: StoreType) => {
    setStoreTypeSelected(storeType);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    try {
      await storeTypeApi.remove(storeTypeSelected?.id || 0);
      const newFilter = { ...filter };
      dispatch(storeTypeActions.setFilter(newFilter));
      enqueueSnackbar(`${storeTypeSelected?.name} ${t('segment.deleteSuccess')}`, {
        variant: 'success',
      });

      setStoreTypeSelected(undefined);
      setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(`${storeTypeSelected?.name} ${t('common.errorText')}`, { variant: 'error' });
    }
  };

  // header
  const { t } = useTranslation();
  const headCells = [
    { id: 'no', label: '#' },
    { id: 'name', label: 'Loại cửa hàng' },
    { id: 'parentStoreTypeName', label: t('store.storeTypeName') },
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
  const handelDetailsClick = (storeType: StoreType) => {
    navigate(`${PATH_DASHBOARD.storeType.details}/${storeType.id}`);
  };
  const handelEditsClick = (storeType: StoreType) => {
    navigate(`${PATH_DASHBOARD.storeType.editInfo}/${storeType.id}`);
  };

  const schema = yup.object().shape({
    name: yup.string().required(t('segment.errorSegmentName')),
  });
  const storeTypeForm = useForm({
    resolver: yupResolver(schema),
    shouldUnregister: true,
  });
  const { control } = storeTypeForm;
  const updateStoreType = useForm({
    shouldUnregister: true,
  });
  const { control: controlUpdate } = updateStoreType;
  return (
    <Page
      title={t('Quản lí loại cửa hàng')}
      actions={() => [
        <StoreTypeForm
          key={''}
          maxWidth="sm"
          onOk={async () => {
            try {
              await storeTypeForm.handleSubmit((data: any) => storeTypeApi.add(data))();
              enqueueSnackbar(`Tạo loại cửa hàng thành công`, {
                variant: 'success',
              });
              const newFilter = { ...filter };
              dispatch(storeTypeActions.setFilter(newFilter));
              return true;
            } catch (error) {
              enqueueSnackbar('Có lỗi', { variant: 'error' });
              return false;
            }
          }}
          title={<Typography variant="h3">Tạo loại cửa hàng</Typography>}
          trigger={
            <Button
              component={RouterLink}
              variant="contained"
              sx={{ width: '100%', height: '100%' }}
              to={`${PATH_DASHBOARD.storeType.editInfo}/${storeTypeSelected?.id}`}
              startIcon={<Icon icon={plusFill} />}
            >
              {'Thêm loại cửa hàng'}
            </Button>
          }
        >
          <FormProvider {...storeTypeForm}>
            <Grid container spacing={2}>
              <Grid item xs={12} display={'flex'} alignItems={'center'}>
                <InputField fullWidth required name="name" label="Tên loại cửa hàng" />
                <SelectField
                  name="parentStoreTypeId"
                  label={`${t('store.storeTypeName')}*`}
                  control={control}
                  options={storeTypesOptions}
                />
              </Grid>
            </Grid>
          </FormProvider>
        </StoreTypeForm>,
      ]}
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Danh sách loại cửa hàng'}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('segment.listSegment') },
          ]}
        />

        <Card>
          <StoreTypeFilter filter={filter} onSearchChange={handelSearchDebounce} />

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
                      <TableCell align="left">
                        {e.parentStoreTypeName === '' ? t('store.none') : e.parentStoreTypeName}
                      </TableCell>
                      <TableCell width={250}>
                        <Box style={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip key={`btnDetails-${e.id}`} title={t('common.details') || ''}>
                            <StoreTypeForm
                              key={''}
                              maxWidth="sm"
                              onOk={async () => {
                                try {
                                  await updateStoreType.handleSubmit((data: any) =>
                                    storeTypeApi.update(Number(storeTypeId), data)
                                  )();
                                  enqueueSnackbar(`Tạo loại cửa hàng thành công`, {
                                    variant: 'success',
                                  });
                                  const newFilter = { ...filter };
                                  dispatch(storeTypeActions.setFilter(newFilter));
                                  return true;
                                } catch (error) {
                                  enqueueSnackbar('Có lỗi', { variant: 'error' });
                                  return false;
                                }
                              }}
                              title={<Typography variant="h3">Chỉnh sửa loại cửa hàng</Typography>}
                              trigger={
                                <Tooltip title="Chỉnh sửa">
                                  <IconButton
                                    onClick={() => {
                                      console.log(e);
                                      updateStoreType.reset(e);
                                      handelEditsClick(e);
                                    }}
                                    size="large"
                                  >
                                    <Icon icon={editFill} />
                                  </IconButton>
                                </Tooltip>
                              }
                            >
                              <FormProvider {...updateStoreType}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} display={'flex'} alignItems={'center'}>
                                    <InputField
                                      fullWidth
                                      required
                                      name="name"
                                      label="Tên loại cửa hàng"
                                    />
                                    <SelectField
                                      name="parentStoreTypeId"
                                      label={`${t('store.storeTypeName')}*`}
                                      control={controlUpdate}
                                      options={storeTypesOptions}
                                    />
                                  </Grid>
                                </Grid>
                              </FormProvider>
                            </StoreTypeForm>
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
            {`${t('segment.removeTitleStart') + storeTypeSelected?.name} ${t(
              'segment.removeTitleEnd'
            )}`}
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
