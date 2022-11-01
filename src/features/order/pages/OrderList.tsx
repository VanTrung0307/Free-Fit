/* eslint-disable no-nested-ternary */
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
// material
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
// material
import orderApi from 'api/orderApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
import ReportOrderAnalytic from 'features/report/components/ReportOrderAnalytic';
// hooks
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import AccessibleIcon from '@mui/icons-material/Accessible';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import useSettings from 'hooks/useSettings';
import { Order } from 'models';
import { GetStatusOrderMap } from 'models/dto/orderStatus';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// redux
// routes
import { DateRange, DateRangePicker } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import axiosClient from 'api/axiosClient';
import ResoTable from 'components/table/ResoTable';
import { TTableColumn } from 'components/table/table';
import ReportBtn from 'features/report/components/ReportBtn';
import { selectStoreResponse, storeActions } from 'features/store-management/storeSlice';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { PATH_DASHBOARD } from 'routes/paths';
import { parseParams } from 'utils/axios';
import { fDateTimeSuffix2, fDateTimeSuffix3, formatDate } from 'utils/formatTime';
import { fCurrency } from 'utils/formatNumber';
import Label from 'components/Label';
import moment from 'moment';
import OrderFormV2 from '../components/OrderFormV2';
import {
  orderActions,
  selectFilter,
  selectReportFilterInRange,
  selectReportInRangeResponse,
} from '../orderSlice';
import './style.css';

// ----------------------------------------------------------------------

export default function OrderList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const reportFilterInRange = useAppSelector(selectReportFilterInRange);
  const report = useAppSelector(selectReportInRangeResponse);

  const { enqueueSnackbar } = useSnackbar();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [orderSelected, setOrderSelected] = useState<Order>();
  const { paymentMethod } = GetStatusOrderMap();
  const [popupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();
  const { storeId } = useParams();
  const ref = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();
  useEffect(() => {}, [dispatch]);

  const storeOptions = useAppSelector(selectStoreResponse);
  const storeOption = storeOptions?.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  // effect
  useEffect(() => {
    dispatch(storeActions.fetchStore());
    dispatch(orderActions.fetchReportInRange(reportFilterInRange));
  }, [dispatch, reportFilterInRange]);

  const handelDetailsClick = (order: Order) => {
    setOrderSelected(order);
    setPopupOpen(true);
  };

  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem('orderPage') || '1', 10)
  );
  useEffect(() => {
    localStorage.setItem('orderPage', JSON.stringify(currentPage));
  }, [currentPage]);
  const handelRemoveClick = (team: Order) => {
    setOrderSelected(team);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    try {
      await orderApi.remove(Number(orderSelected?.id) || 0).then(() => ref.current?.reload);
      const newFilter = { ...filter };
      dispatch(orderActions.setFilter(newFilter));
      enqueueSnackbar(`${orderSelected?.orderCode} ${t('store.deleteSuccess')}`, {
        variant: 'success',
      });

      setOrderSelected(undefined);
      setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(`${orderSelected?.orderCode} ${t('common.errorText')}`, { variant: 'error' });
    }
  };
  const [store, setStore] = useState<any>(null);
  const handleChange = (event: any, newValue: any) => {
    setStore(newValue);
  };
  useEffect(() => {
    if (ref.current && storeId === undefined) {
      ref.current.formControl.setValue('storeId', store?.value);
    }
  }, [store, storeId]);

  const yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);
  const [dateRange, setDateRange] = useState<DateRange<Date>>([null, null]);
  const [date, setDate] = useState({
    fromDate: '',
    toDate: '',
  });
  useEffect(() => {
    if (ref.current && dateRange[0] && dateRange[1]) {
      ref.current.formControl.setValue('FromDate', formatDate(dateRange[0]!));
      ref.current.formControl.setValue('ToDate', formatDate(dateRange[1]!));
    }
  }, [dateRange]);

  const formMethod = useForm<any>();
  type TOrderBase = {
    agent: {
      id: number;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      username?: string;
      password?: string;
      role?: number;
      agentType?: number;
      transportType?: number;
      teamId?: number;
      teamName?: string;
      address?: string;
      licencePlate?: string;
      color?: string;
      createDate?: any;
      status?: number;
    };
    fromStation?: {
      id?: number;
      code?: string;
      longitude?: number;
      latitude?: number;
      address?: string;
      district?: string;
      ward?: string;
      city?: string;
      createdAt?: any;
      updatedAt?: any;
    };
    toStation?: {
      id?: number;
      code?: string;
      longitude?: number;
      latitude?: number;
      address?: string;
      district?: string;
      ward?: string;
      city?: string;
      createdAt?: any;
      updatedAt?: any;
    };
    id?: number;
    fromStationId?: number;
    toStationId?: number;
    createdAt?: any;
    updatedAt?: any;
    orderCode?: string;
    storeId?: any;
    storeCode?: string;
    status?: number;
    customerPhone?: string;
    customerName?: string;
    orderAmount?: number;
    paymentMethod?: number;
    isCOD?: boolean;
    shippingFee?: number;
    distanceFee?: number;
    surCharge?: number;
    brandId?: number;
    notes?: string;
    store?: {
      id?: number;
      name?: string;
      phone?: string;
    };
  };
  const orderColumn: TTableColumn<TOrderBase>[] = [
    {
      title: '',
      dataIndex: 'index',
      hideInTable: true,
      renderFormItem(columnSetting, formProps) {
        return (
          <DateRangePicker
            inputFormat="dd/MM/yyyy"
            // minDate={moment(`${today.getFullYear()}/${today.getMonth()}/01`).toDate()}
            disableFuture
            value={dateRange}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} label="Từ" />
                <Box sx={{ mx: 2 }}> - </Box>
                <TextField {...endProps} label="Đến" />
              </>
            )}
            onChange={(e) => {
              if (e[0] && e[1]) {
                setDateRange(e);
                setDate({
                  fromDate: moment(e[0]).format('YYYY/MM/DD'),
                  toDate: moment(e[1]).format('YYYY/MM/DD'),
                });
              }
            }}
          />
        );
      },
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      hideInSearch: true,
      hideInTable: false,
      sortable: false,
    },
    {
      title: 'Cửa hàng',
      dataIndex: 'store',
      hideInSearch: true,
      hideInTable: false,
      sortable: false,
      render(value) {
        return value.name;
      },
    },
    {
      title: 'Cửa hàng',
      dataIndex: 'storeId',
      hideInSearch: storeId !== undefined,
      hideInTable: true,
      renderFormItem() {
        return (
          <Autocomplete
            value={store}
            onChange={handleChange}
            id="controllable-states-demo"
            options={storeOption}
            renderInput={(params) => <TextField {...params} label="Cửa hàng" />}
          />
        );
      },
    },
    {
      title: 'Điểm giao hàng',
      dataIndex: 'toStation',
      hideInSearch: true,
      hideInTable: false,
      sortable: false,
      render(value, data, index) {
        return value.address;
      },
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      hideInSearch: true,
      hideInTable: false,
      sortable: false,
    },
    {
      title: 'SĐT',
      dataIndex: 'customerPhone',
      hideInSearch: true,
      hideInTable: false,
      sortable: false,
    },
    {
      title: 'Giá trị đơn hàng',
      dataIndex: 'orderAmount',
      hideInSearch: true,
      hideInTable: false,
      sortable: false,
      render(value, data, index) {
        return <Box>{fCurrency(data?.orderAmount!)}</Box>;
      },
    },
    {
      title: 'Phí ship',
      dataIndex: 'shippingFee',
      hideInSearch: true,
      hideInTable: false,
      sortable: false,
      render(value, data, index) {
        return <Box>{fCurrency(data?.shippingFee! + data?.distanceFee! + data?.surCharge!)}</Box>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      hideInSearch: true,
      hideInTable: false,
      sortable: false,
      render(value, data, index) {
        return <Box>{fDateTimeSuffix2(data?.createdAt!)}</Box>;
      },
    },
    {
      title: 'Thánh toán',
      dataIndex: 'paymentMethod',
      hideInSearch: false,
      hideInTable: false,
      sortable: false,
      render(value, data, index) {
        return (
          <Box color={paymentMethod[value]?.color || 'green'} fontWeight="bold">
            {paymentMethod[value]?.name}
          </Box>
        );
      },
      valueEnum: [
        {
          label: 'Tiền mặt (COD)',
          value: '1',
        },
        {
          label: 'Chuyển khoản sau',
          value: '2',
        },
        {
          label: 'Đã thanh toán',
          value: '4',
        },
      ],
      valueType: 'select',
      formProps: {
        fullWidth: true,
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      hideInSearch: false,
      hideInTable: false,
      sortable: false,
      render(value, data, index) {
        return (
          // <Box color={paymentMethod[value]?.color || 'green'} fontWeight="bold">
          //   {paymentMethod[value]?.name}
          // </Box>
          <Label
            color={
              data?.status === 0
                ? 'info'
                : data?.status === 1
                ? 'warning'
                : data?.status === 3
                ? 'warning'
                : data?.status === 4
                ? 'success'
                : 'error'
            }
          >
            {data?.status === 0 && moment(data?.createdAt).utc() > moment(new Date()).utc()
              ? 'Hẹn lại ngày giao'
              : data?.status === 0
              ? 'Mới'
              : data?.status === 1
              ? 'Tài xế nhận đơn'
              : data?.status === 3
              ? 'Đã lấy hàng'
              : data?.status === 4
              ? 'Đã giao hàng'
              : data?.status === 6
              ? 'Đã hủy có tính ship'
              : 'Đã hủy'}
          </Label>
        );
      },
      valueEnum: [
        {
          label: 'Mới',
          value: '0',
        },
        {
          label: 'Tài xế nhận đơn',
          value: '1',
        },
        {
          label: 'Đã lấy hàng',
          value: '3',
        },
        {
          label: 'Đã giao hàng',
          value: '4',
        },
        {
          label: 'Đã hủy',
          value: '5',
        },
      ],
      valueType: 'select',
      formProps: {
        fullWidth: true,
      },
    },
    {
      title: 'Shipper',
      dataIndex: 'agent',
      hideInSearch: true,
      hideInTable: false,
      sortable: false,
      render(value, data, index) {
        // return value.firstName || 'Chưa có tài xế';
        return (
          <Box color={value?.firstName ? 'skyblue' : 'gray'} fontWeight="bold">
            {value?.firstName || 'Chưa có tài xế'}
          </Box>
        );
      },
    },
  ];
  return (
    <FormProvider {...formMethod}>
      <Page title={t('order.list')}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading={t('order.list')}
            links={[
              { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

              { name: t('order.list') },
            ]}
            action={
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.order.add}
                startIcon={<Icon icon={plusFill} />}
              >
                {t('order.titleAdd')}
              </Button>
            }
          />

          <Card sx={{ mb: 2 }}>
            <Stack pt={2} alignItems={'center'}>
              {report?.fromDate && (
                <Typography variant="h6" gutterBottom marginBottom={2}>
                  {fDateTimeSuffix3(report?.fromDate)}
                </Typography>
              )}
            </Stack>
            <Stack pb={2} direction={'row'}>
              <ReportOrderAnalytic
                title="Toàn bộ đơn hàng"
                total={report?.totalOrder}
                percent={100}
                price={2}
                icon="eva:clock-fill"
                color={theme.palette.info.main}
              >
                <AccessibilityNewIcon />
              </ReportOrderAnalytic>
              <ReportOrderAnalytic
                title="Đơn hàng mới"
                total={report?.totalOrderNew}
                percent={100}
                price={0}
                icon="eva:clock-fill"
                color={theme.palette.success.main}
              >
                <AccessibleIcon />
              </ReportOrderAnalytic>

              <ReportOrderAnalytic
                title="Đơn giao thành công"
                total={report?.totalOrderDelivered}
                percent={100}
                price={0}
                icon="eva:clock-fill"
                color={theme.palette.warning.main}
              >
                <LocalShippingIcon />
              </ReportOrderAnalytic>

              <ReportOrderAnalytic
                title="Đơn đã huỷ"
                total={report?.totalOrderCancel}
                percent={100}
                price={0}
                icon="eva:clock-fill"
                color={theme.palette.error.main}
              >
                <AccessibleForwardIcon />
              </ReportOrderAnalytic>
            </Stack>
          </Card>

          <ResoTable
            key={'order-id'}
            ref={ref}
            columns={orderColumn}
            getData={orderApi.getAll}
            toolBarRender={() => [
              <ReportBtn
                key="export-excel"
                onClick={() =>
                  axiosClient
                    .get(
                      `${
                        process.env.REACT_APP_API_URL || 'https://localhost:5001/api/v1.0'
                      }/orders/report/export?${parseParams(date)}`,
                      {
                        method: 'GET',
                        responseType: 'blob', // important
                      }
                    )
                    .then((response) => {
                      console.log(response.data);
                      const url = window.URL.createObjectURL(new Blob([response as any]));
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute(
                        'download',
                        `Báo_Cáo_Đơn_Hàng_Theo_Ngày ${date?.fromDate}-${date?.toDate}.xlsx`
                      );
                      document.body.appendChild(link);
                      link.click();
                    })
                }
              />,
            ]}
            showAction={true}
            onDelete={handelRemoveClick}
            onEdit={handelDetailsClick}
            defaultFilters={{
              storeId: storeId || null,
              // fromDate: formatDate(dateRange[0]!),
              // toDate: formatDate(dateRange[1]!),
            }}
            // pagination={{ showPagination: true, currentPage: 3 }}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </Container>
        <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
          <DialogTitle>{t('common.titleConfirm')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`${t('common.order')}: ${orderSelected?.orderCode} ${t('store.removeTitleEnd')}`}
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
            {orderSelected !== undefined && (
              <OrderFormV2 initialValue={orderSelected} isEdit={false} isView={true} />
            )}
          </DialogContent>
          <DialogActions>
            <Button color="inherit" onClick={() => setPopupOpen(false)}>
              {t('content.btnClose')}
            </Button>
            <Button
              onClick={() => {
                navigate(`${PATH_DASHBOARD.order.edit}/${orderSelected?.id}`);
              }}
              autoFocus
              // disabled={orderSelected?.status !== OrderEnum.New}
            >
              {t('common.editInfo')}
            </Button>
          </DialogActions>
        </Dialog>
      </Page>
    </FormProvider>
  );
}
