import searchFill from '@iconify/icons-eva/search-fill';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import { Icon } from '@iconify/react';
import { DateRange, DateRangePicker } from '@mui/lab';
import {
  Box,
  InputAdornment,
  OutlinedInput,
  Toolbar,
  Autocomplete,
  TextField,
  Stack,
  Grid,
  IconButton,
} from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import axiosClient from 'api/axiosClient';
import orderApi from 'api/orderApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import axios from 'axios';
import { AutoCompleteField } from 'components/form';
import ReportBtn from 'features/report/components/ReportBtn';
import { selectStoreResponse, storeActions } from 'features/store-management/storeSlice';
import { PaginationRequest, PaymentMethod } from 'models';
import moment from 'moment';
import { ChangeEvent, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { parseParams } from 'utils/axios';
import { orderActions } from '../orderSlice';

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 50,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

const paymentMethods = [
  {
    id: PaymentMethod.Cash,
    name: 'Tiền mặt (COD)',
  },
  {
    id: PaymentMethod.Bank,
    name: 'Chuyển khoản sau',
  },
  {
    id: PaymentMethod.Paid,
    name: 'Đã thanh toán',
  },
];
const paymentMethodOptions = paymentMethods?.map((c: any) => ({ label: c.name, value: c.id }));
const getPaymentMethod = (option: any) => {
  if (!option) return option;
  if (!option.value) return paymentMethodOptions?.find((opt: any) => opt.value === option);
  return option;
};

const orderStatus = [
  {
    id: 0,
    name: 'Đơn hàng mới',
  },
  {
    id: 1,
    name: 'Đang giao hàng',
  },
  {
    id: 3,
    name: 'Đã lấy',
  },
  {
    id: 4,
    name: 'Đã giao',
  },
  {
    id: 5,
    name: 'Đã hủy',
  },
];
const orderStatusOptions = orderStatus?.map((c: any) => ({ label: c.name, value: c.id }));
const getOrderStatus = (option: any) => {
  if (!option) return option;
  if (!option.value) return orderStatusOptions?.find((opt: any) => opt.value === option);
  return option;
};

type OrderFilterProps = {
  filter: PaginationRequest;
  onChange?: (newFilter: PaginationRequest) => void;
  onSearchChange?: (newFilter: PaginationRequest) => void;
  data?: any;
  searchBy?: string;
};

export function OrderFilter({ filter, onChange, onSearchChange }: OrderFilterProps) {
  const { t } = useTranslation();
  const methods = useFormContext();
  const dispatch = useAppDispatch();
  const onPickDate = (from: string, to: string) => {
    dispatch(
      orderActions.setFilter({
        ...filter,
        fromDate: from,
        toDate: to,
      })
    );
  };
  const onFilterStoreOrders = (storeId: number) => {
    dispatch(
      orderActions.setFilter({
        ...filter,
        storeId,
      })
    );
  };
  const onFilterPaymentMethodOrders = (paymentMethod: number) => {
    dispatch(
      orderActions.setFilter({
        ...filter,
        paymentMethod,
      })
    );
  };
  const onFilterOrderStatus = (status: number) => {
    dispatch(
      orderActions.setFilter({
        ...filter,
        status,
      })
    );
  };
  const onRefresh = () => {
    dispatch(orderActions.setFilter({}));
    dispatch(
      orderActions.setReportFilterInRange({
        fromDate: moment(new Date()).format('YYYY/MM/DD'),
        toDate: moment(new Date()).format('YYYY/MM/DD'),
      })
    );
  };
  const today = new Date();
  const yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);
  const [dateRange, setDateRange] = useState<DateRange<Date>>([yesterday, yesterday]);
  const [done, setDone] = useState(true);
  const [date, setDate] = useState({
    fromDate: '',
    toDate: '',
  });
  const { control, setValue, getValues, watch } = methods;

  useEffect(() => {
    dispatch(storeActions.fetchStore());
  }, [dispatch]);

  const storeOptions = useAppSelector(selectStoreResponse);
  const storeOption = storeOptions?.map((c) => ({
    label: c.name,
    value: c.id,
    address: c.address,
    storeCode: c.storeCode,
  }));
  const getStoreObj = (option: any) => {
    if (!option) return option;
    if (!option.value) return storeOption.find((opt) => opt.value === option);
    return option;
  };

  const onExportExcel = () => {
    // orderApi
    //   .getExportExcel({
    //     date,
    //   })
    //   .then((res) => {
    //     const url = window.URL.createObjectURL(new Blob([res.data]));
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', `${Date.now()}.xlsx`);
    //     document.body.appendChild(link);
    //     link.click();
    //   });
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
      });
    // window.open(`https://localhost:5001/api/v1.0/orders/report/export?${parseParams(date)}`);
  };

  return (
    <RootStyle>
      <Stack width={'40%'}>
        <DateRangePicker
          inputFormat="dd/MM/yyyy"
          minDate={moment(`${today.getFullYear()}/${today.getMonth()}/01`).toDate()}
          // disabled={loading}
          disableCloseOnSelect
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
            onPickDate(moment(e[0]).format('YYYY/MM/DD'), moment(e[1]).format('YYYY/MM/DD'));
          }}
          onOpen={() => setDone(false)}
          onClose={() => setDone(true)}
          key="date-range"
        />
      </Stack>
      <Grid container spacing={2} mx={1}>
        <Grid item xs={3}>
          <AutoCompleteField
            options={storeOption}
            getOptionLabel={(value: any) => getStoreObj(value)?.label || ''}
            isOptionEqualToValue={(option: any, value: any) => {
              if (!option) return option;
              return option.value === getStoreObj(value)?.value;
            }}
            transformValue={(opt: any) => opt?.value}
            size="small"
            type="text"
            label={'Cửa hàng'}
            name={'store'}
            fullWidth
            onChange={(index, newValue: any) => {
              onFilterStoreOrders(newValue?.value);
              setValue('store', newValue?.value);
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <AutoCompleteField
            options={paymentMethodOptions}
            getOptionLabel={(value: any) => getPaymentMethod(value)?.label || ''}
            isOptionEqualToValue={(option: any, value: any) => {
              if (!option) return option;
              return option.value === getPaymentMethod(value)?.value;
            }}
            transformValue={(opt: any) => opt?.value}
            size="small"
            type="text"
            label={'Phương thức thanh toán'}
            name={'payment'}
            fullWidth
            onChange={(index, newValue: any) => {
              onFilterPaymentMethodOrders(newValue?.value);
              setValue('payment', newValue?.value);
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <AutoCompleteField
            options={orderStatusOptions}
            getOptionLabel={(value: any) => getOrderStatus(value)?.label || ''}
            isOptionEqualToValue={(option: any, value: any) => {
              if (!option) return option;
              return option.value === getOrderStatus(value)?.value;
            }}
            transformValue={(opt: any) => opt?.value}
            size="small"
            type="text"
            label={'Trạng thái đơn hàng'}
            name={'status'}
            fullWidth
            onChange={(index, newValue: any) => {
              onFilterOrderStatus(newValue?.value);
              setValue('status', newValue?.value);
            }}
          />
        </Grid>
      </Grid>
      <Stack>
        <ReportBtn key="export-excel" onClick={onExportExcel} />
      </Stack>
      <Stack ml={2}>
        <IconButton aria-label="refresh" onClick={onRefresh}>
          <RefreshIcon />
        </IconButton>
      </Stack>
    </RootStyle>
  );
}
// function dispatch(arg0: { payload: import('models').OrderPagingRequest; type: string }) {
//   throw new Error('Function not implemented.');
// }
