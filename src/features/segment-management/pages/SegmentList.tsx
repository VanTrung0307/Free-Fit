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
import { Box } from '@mui/system';
import segmentApi from 'api/segmentApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useTable } from 'components/common';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
// hooks
import useSettings from 'hooks/useSettings';
import { PaginationRequest, Segment } from 'models';
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
import SegmentForm from '../components/SegmentForm';
import SegmentFilter from '../components/SegmentFilter';
import {
  selectFilter,
  selectLoading,
  selectSegmentsResponse,
  segmentActions,
} from '../segmentSlice';

// ----------------------------------------------------------------------

export default function SegmentList() {
  const { segmentId } = useParams();
  const isEdit = Boolean(segmentId);
  const { themeStretch } = useSettings();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [segmentSelected, setSegmentSelected] = useState<Segment>();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const rs = useAppSelector(selectSegmentsResponse);
  const loading = useAppSelector(selectLoading);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // effect
  useEffect(() => {
    dispatch(segmentActions.fetchSegments(filter));
  }, [dispatch, filter]);
  const onPageChange = (page: number) => {
    dispatch(
      segmentActions.setFilter({
        ...filter,
        page: page + 1,
      })
    );
  };
  const onRowPerPageChange = (perPage: number) => {
    dispatch(
      segmentActions.setFilter({
        ...filter,
        pageSize: perPage,
      })
    );
  };
  const onSortChange = (colName: string, sortType: number) => {
    dispatch(
      segmentActions.setFilter({
        ...filter,
        colName,
        sortType,
      })
    );
  };
  const handelSearchDebounce = (newFilter: PaginationRequest) => {
    dispatch(segmentActions.setFilterWithDebounce(newFilter));
  };

  const handelRemoveClick = (segment: Segment) => {
    setSegmentSelected(segment);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    try {
      await segmentApi.remove(segmentSelected?.id || 0);
      const newFilter = { ...filter };
      dispatch(segmentActions.setFilter(newFilter));
      enqueueSnackbar(`${segmentSelected?.name} ${t('segment.deleteSuccess')}`, {
        variant: 'success',
      });

      setSegmentSelected(undefined);
      setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(`${segmentSelected?.name} ${t('common.errorText')}`, { variant: 'error' });
    }
  };

  // header
  const { t } = useTranslation();
  const headCells = [
    { id: 'no', label: '#' },
    { id: 'name', label: t('segment.segmentName') },
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
  const handelDetailsClick = (segment: Segment) => {
    navigate(`${PATH_DASHBOARD.segment.details}/${segment.id}`);
  };
  const handelEditsClick = (segment: Segment) => {
    navigate(`${PATH_DASHBOARD.segment.editInfo}/${segment.id}`);
  };

  const schema = yup.object().shape({
    name: yup.string().required(t('segment.errorSegmentName')),
  });
  const segmentForm = useForm({
    resolver: yupResolver(schema),
    shouldUnregister: true,
  });
  const updateSegment = useForm({
    shouldUnregister: true,
  });
  return (
    <Page
      title={t('Quản lí lĩnh vực')}
      actions={() => [
        <SegmentForm
          key={''}
          maxWidth="sm"
          onOk={async () => {
            try {
              await segmentForm.handleSubmit((data: any) => segmentApi.add(data))();
              enqueueSnackbar(`Tạo lĩnh vực thành công`, {
                variant: 'success',
              });
              const newFilter = { ...filter };
              dispatch(segmentActions.setFilter(newFilter));
              return true;
            } catch (error) {
              enqueueSnackbar('Có lỗi', { variant: 'error' });
              return false;
            }
          }}
          title={<Typography variant="h3">Tạo lĩnh vực</Typography>}
          trigger={
            <Button
              component={RouterLink}
              variant="contained"
              sx={{ width: '100%', height: '100%' }}
              to={`${PATH_DASHBOARD.segment.editInfo}/${segmentSelected?.id}`}
              startIcon={<Icon icon={plusFill} />}
            >
              {t('segment.btnAdd')}
            </Button>
          }
        >
          <FormProvider {...segmentForm}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InputField fullWidth required name="name" label="Tên lĩnh vực" />
              </Grid>
            </Grid>
          </FormProvider>
        </SegmentForm>,
      ]}
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('segment.listSegment')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('segment.listSegment') },
          ]}
        />

        <Card>
          <SegmentFilter filter={filter} onSearchChange={handelSearchDebounce} />

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
                      <TableCell width={250}>
                        <Box style={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip key={`btnDetails-${e.id}`} title={t('common.details') || ''}>
                            <SegmentForm
                              maxWidth="sm"
                              onOk={async () => {
                                try {
                                  await updateSegment.handleSubmit((data: any) =>
                                    segmentApi.update(Number(segmentId), data)
                                  )();
                                  enqueueSnackbar(`Tạo lĩnh vực thành công`, {
                                    variant: 'success',
                                  });
                                  const newFilter = { ...filter };
                                  dispatch(segmentActions.setFilter(newFilter));
                                  return true;
                                } catch (error) {
                                  enqueueSnackbar('Có lỗi', { variant: 'error' });
                                  return false;
                                }
                              }}
                              title={<Typography variant="h3">Chỉnh sửa lĩnh vực</Typography>}
                              trigger={
                                <Tooltip title="Chỉnh sửa">
                                  <IconButton
                                    onClick={() => {
                                      updateSegment.reset(e);
                                      handelEditsClick(e);
                                    }}
                                    size="large"
                                  >
                                    <Icon icon={editFill} />
                                  </IconButton>
                                </Tooltip>
                              }
                            >
                              <FormProvider {...updateSegment}>
                                <Grid container spacing={2}>
                                  <Grid item xs={6}>
                                    <InputField
                                      fullWidth
                                      required
                                      name="name"
                                      label="Tên lĩnh vực"
                                    />
                                  </Grid>
                                </Grid>
                              </FormProvider>
                            </SegmentForm>
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
            {`${t('segment.removeTitleStart') + segmentSelected?.name} ${t(
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
