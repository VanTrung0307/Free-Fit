import plusFill from '@iconify/icons-eva/plus-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { Icon } from '@iconify/react';
import {
  Box,
  Card,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useDebouncedCallback } from 'components/common';
import { AutoCompleteField } from 'components/form';
import InputAreaField from 'components/FormField/InputAreaField';
import InputField from 'components/FormField/InputField';
import InputFieldNumberFormat from 'components/FormField/InputFieldNumberFormat';
import RHFRadioGroup from 'components/hook-form/RHFRadioGroup';
import { agentActions, selectAgentOptions, selectFilter } from 'features/agent/agentSlice';
import { selectStoreResponse, storeActions } from 'features/store-management/storeSlice';
import { OrderInfo, PaymentMethod } from 'models';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { orderActions, selectBuildingsResponse } from '../orderSlice';

interface OrderInformationFormProps {
  isView: boolean;
  isEdit: boolean;
}

export const OrderInformationFormV2 = ({ isView, isEdit }: OrderInformationFormProps) => {
  const { t } = useTranslation();
  const methods = useFormContext();
  const dispatch = useAppDispatch();
  const [listItems, setListItems] = useState<number[]>([0]);
  const [isCod, setIsCod] = useState(methods.watch('isCOD') || true);
  const [status, setStatus] = useState(methods.watch('status') || 0);
  const [paymentMethod, setPaymentMethod] = useState(Number(methods.watch('paymentMethod')) || 1);
  const [message, setMessage] = useState('Đã thanh toán');
  const filterAgent = useAppSelector(selectFilter);
  function handleClick() {
    setIsCod(!isCod);
  }

  const paymentMethods = [
    // {
    //   id: PaymentMethod.Cash,
    //   name: 'Tiền mặt (COD)',
    // },
    // {
    //   id: PaymentMethod.Paid,
    //   name: 'Đã thanh toán',
    // },
    {
      id: PaymentMethod.Cash,
      name: 'Tiền mặt (COD)',
    },
    {
      id: PaymentMethod.Bank,
      name: 'Chuyển khoản',
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
    {
      id: 6,
      name: 'Đã hủy có tính ship',
    },
  ];

  const { control, setValue, getValues, watch } = methods;
  useEffect(() => {
    dispatch(orderActions.fetchBuilding());
    dispatch(storeActions.fetchStore());
    dispatch(
      agentActions.fetchAgentList({
        ...filterAgent,
        pageSize: 100,
      })
    );
    if (isView || isEdit) {
      const list = getValues('packageItems');
      const newList = list?.map((e, idx) => idx);
      const infoObj = getValues('orderInfo');
      try {
        const obj: OrderInfo = JSON.parse(infoObj);
        setValue('orderInfoObj', obj, {
          shouldDirty: true,
        });
        // eslint-disable-next-line no-empty
      } catch (error) {}

      setListItems(newList);
    }
    if (isCod) {
      setValue('isCod', true);
      setMessage('Thanh toán bằng tiền mặt (COD)');
    } else {
      setValue('isCod', false);
      setMessage('Đã thanh toán');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues, isView, isCod, paymentMethod]);

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

  const buildingOptions = useAppSelector(selectBuildingsResponse);
  const buildingOption = buildingOptions?.map((c) => ({
    label: c.name,
    value: c.id,
  }));
  const getBuildingObj = (option: any) => {
    if (!option) return option;
    if (!option.value) return buildingOption.find((opt) => opt.value === option);
    return option;
  };

  const agentList = useAppSelector(selectAgentOptions);
  const agentOptions = agentList?.map((c) => ({
    label: c.name,
    value: c.id,
  }));
  const getAgentObj = (option: any) => {
    if (!option) return option;
    if (!option.value) return agentOptions.find((opt) => opt.value === option);
    return option;
  };

  const handelInputFieldAddress = useDebouncedCallback((value) => {
    setValue('fromStation.address', value);
  }, 500);

  const handelAddItem = () => {
    if (isView) return;
    const newList = [...listItems];
    newList.push(newList.length);
    setListItems(newList);
  };
  const handelRemoveItem = (index: number) => {
    if (isView) return;
    const newList = [...listItems];
    newList.splice(index, 1);
    setValue(`packageItems[${index}].code`, '', {
      shouldDirty: true,
    });
    setValue(`packageItems[${index}].quantity`, '', {
      shouldDirty: true,
    });
    setValue(`packageItems[${index}].description`, '', {
      shouldDirty: true,
    });
    setListItems(newList);
  };
  const renderFormItem = (index) => (
    <Box
      key={`box-${index}`}
      style={{
        border: '1px solid',
        borderRadius: '10px',
        borderStyle: 'dashed',
        padding: '16px',
        marginBottom: '16px',
      }}
    >
      <CardHeader
        style={{ padding: '0px 0px 16px 0px' }}
        action={
          <Tooltip key={`remove-${index}`} title={t('common.remove') || ''}>
            <span>
              <IconButton
                disabled={listItems.length === 1}
                color="error"
                onClick={() => handelRemoveItem(index)}
                size="large"
              >
                <Icon icon={trash2Outline} />
              </IconButton>
            </span>
          </Tooltip>
        }
        title={`${t('order.item')} ${index + 1}`}
      />
      <Stack spacing={2}>
        <InputField
          name={`packageItems[${index}].code`}
          label={`${t('order.codeItem')}*`}
          control={control}
          disabled={isView}
        />
        <InputField
          name={`packageItems[${index}].quantity`}
          label={`${t('order.quantity')}*`}
          type="number"
          control={control}
          disabled={isView}
        />
        <InputField
          name={`packageItems[${index}].description`}
          label={`${t('order.description')}*`}
          control={control}
          disabled={isView}
        />
      </Stack>
    </Box>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom marginBottom={2}>
            {t('order.info')}
          </Typography>
          <Stack spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
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
                  name={'store.id'}
                  fullWidth
                  onChange={(index, newValue: any) => {
                    setValue('store.id', newValue?.value);
                    setValue('fromStation.code', newValue?.storeCode);
                    setValue('storeCode', newValue?.storeCode);
                    handelInputFieldAddress(newValue?.address);
                  }}
                  disabled={isView}
                />
                <InputField
                  name="fromStation.address"
                  label={`Địa chỉ lấy hàng*`}
                  control={control}
                  disabled={isView}
                />
              </Box>
            </Grid>

            <Typography variant="h6" gutterBottom marginBottom={2}>
              {'Thông tin người nhận'}
            </Typography>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <AutoCompleteField
                  options={buildingOption}
                  getOptionLabel={(value: any) => getBuildingObj(value)?.label || ''}
                  isOptionEqualToValue={(option: any, value: any) => {
                    if (!option) return option;
                    return option.value === getBuildingObj(value)?.value;
                  }}
                  transformValue={(opt: any) => opt?.value}
                  size="small"
                  type="text"
                  label={'Địa điểm giao'}
                  name={'toStation.id'}
                  fullWidth
                  onChange={(index, newValue: any) => {
                    setValue('station', newValue?.value);
                    setValue('toStation.id', newValue?.value);
                    setValue('toStation.address', newValue?.label);
                  }}
                  disabled={isView}
                />
                <InputField
                  name="toStation.address"
                  label={`Địa chỉ giao cụ thể*`}
                  control={control}
                  disabled={isView}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <InputField
                  name="customerName"
                  label={`${t('order.receiverName')}*`}
                  control={control}
                  disabled={isView}
                />
                <InputField
                  name="customerPhone"
                  label={`${t('order.phone')}*`}
                  control={control}
                  disabled={isView}
                />
              </Box>
            </Grid>

            <Typography variant="h6" gutterBottom marginBottom={2}>
              {'Phương thức thanh toán'}
            </Typography>
            <Stack direction={'row'}>
              {/* <FormControlLabel
                control={
                  <Switch
                    checked={isCod}
                    onChange={() => handleClick()}
                    name="isCOD"
                    color="primary"
                  />
                }
                label={'Thanh toán bằng tiền mặt (COD)'}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={!isCod}
                    onChange={() => handleClick()}
                    name="isCOD"
                    color="primary"
                  />
                }
                label={'Đã thanh toán'}
              /> */}
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="paymentMethod"
                  onChange={(e) => {
                    setPaymentMethod(Number(e.target.value));
                    setValue('paymentMethod', e.target.value);
                    if (Number(e.target.value) === 1) {
                      setIsCod(true);
                    } else {
                      setIsCod(false);
                    }
                  }}
                  value={paymentMethod}
                >
                  {paymentMethods?.map((o, index) => (
                    <FormControlLabel
                      key={index}
                      value={o?.id} // <---- pass a primitive id value, don't pass the whole object here
                      control={<Radio />}
                      label={o.name}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Stack>
            {isEdit && (
              <Stack>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">Trạng thái đơn hàng</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="status"
                    onChange={(e) => {
                      setValue('status', e.target.value);
                      setStatus(e.target.value);
                    }}
                    value={status}
                  >
                    {orderStatus?.map((o, index) => (
                      <FormControlLabel
                        key={index}
                        value={o?.id} // <---- pass a primitive id value, don't pass the whole object here
                        control={<Radio />}
                        label={o.name}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Stack>
            )}
          </Stack>
          <Grid item xs={12} mt={2}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
              }}
            >
              {/* <AutoCompleteField
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
                  name={'paymentMethod'}
                  fullWidth
                  disabled={isView}
                /> */}
              <InputField
                name="orderAmount"
                label={`Giá trị đơn hàng*`}
                control={control}
                disabled={isView}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 2 }}>
                <InputField
                  name="shippingFee"
                  label={`Phí ship*`}
                  control={control}
                  disabled={isView}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 2 }}>
                <InputField
                  name="distanceFee"
                  label={`'Phí quãng đường*`}
                  control={control}
                  disabled={isView}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 2 }}>
                <InputField
                  name="surCharge"
                  label={`'Phụ phí*`}
                  control={control}
                  disabled={isView}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 2 }}>
                <AutoCompleteField
                  options={agentOptions}
                  getOptionLabel={(value: any) => getAgentObj(value)?.label || ''}
                  isOptionEqualToValue={(option: any, value: any) => {
                    if (!option) return option;
                    return option.value === getAgentObj(value)?.value;
                  }}
                  transformValue={(opt: any) => opt?.value}
                  size="small"
                  type="text"
                  label={'Chọn tài xế giao'}
                  name={'driverId'}
                  fullWidth
                  onChange={(index, newValue: any) => {
                    setValue('driverId', newValue?.value || null);
                  }}
                  disabled={isView}
                />
              </Stack>
            </Box>
          </Grid>

          <Stack mt={2}>
            <InputAreaField
              name="notes"
              label={t('order.note')}
              control={control}
              disabled={isView}
            />
          </Stack>
          {(status === 5 || status === 6) && (
            <Stack mt={2}>
              <InputAreaField
                name="cancelReason"
                label={'Lý do huỷ đơn'}
                control={control}
                disabled={isView}
              />
            </Stack>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};
