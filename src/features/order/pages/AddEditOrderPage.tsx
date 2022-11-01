import { Box, Container, Grid } from '@mui/material';
import orderApi from 'api/orderApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import { selectFilter } from 'features/pois-brand/poiBrandSlice';
import useSettings from 'hooks/useSettings';
import { Order } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import OrderForm from '../components/OrderForm';
import OrderFormV2 from '../components/OrderFormV2';
import { orderActions } from '../orderSlice';
import './style.css';

export default function AddEditOrderPage() {
  const { orderId } = useParams();
  const isEdit = Boolean(orderId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [order, setOrder] = useState<Order>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  console.log(params);
  // const user = getCurrentUser();
  useEffect(() => {
    if (!orderId) return;

    // IFFE
    (async () => {
      try {
        const data: Order = await orderApi.getById(orderId);
        setOrder(data);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, [orderId]);
  const handelStoreFormSubmit = async (formValues: Order) => {
    if (!isEdit) {
      try {
        formValues.orderInfo = JSON.stringify(formValues.orderInfoObj);
        await orderApi.add(formValues);
        enqueueSnackbar(`${formValues?.orderCode} ${t('order.addSuccess')}`, {
          variant: 'success',
        });
        const newFilter = { ...filter };
        console.log(newFilter);
        dispatch(orderActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.order.root);
      } catch (error) {
        enqueueSnackbar(`${formValues?.orderCode} ${t('common.errorText')}`, { variant: 'error' });
      }
    } else {
      try {
        formValues.orderInfo = JSON.stringify(formValues.orderInfoObj);
        await orderApi.update(orderId, formValues);
        enqueueSnackbar(
          `${t('order.updateSuccessStart') + formValues.orderCode} ${t('team.updateSuccessEnd')}`,
          { variant: 'success' }
        );
        const newFilter = { ...filter };
        dispatch(orderActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.order.root);
      } catch (error) {
        enqueueSnackbar(`${formValues?.orderCode} ${t('common.errorText')}`, { variant: 'error' });
      }
    }
  };
  const initialValues: Order = {
    batchId: '',
    fromStation: {
      address: '',
      city: '',
      code: '',
      district: '',
      latitude: '',
      longitude: '',
      ward: '',
      createdAt: '',
      deletedAt: '',
      updatedAt: '',
    },
    toStation: {
      address: '',
      city: '',
      code: '',
      district: '',
      latitude: '',
      longitude: '',
      ward: '',
      createdAt: '',
      deletedAt: '',
      updatedAt: '',
    },
    orderInfoObj: {
      cod: '',
      height: '',
      incurred: '',
      length: '',
      note: '',
      serviceCharge: '',
      totalPriceOrder: '',
      weight: '',
      width: '',
    },
    orderCode: '',
    orderInfo: '',
    customerEmail: '',
    customerName: '',
    customerPhone: '',
    packageItems: [],
    status: 0,
    createdAt: '',
    fromStationId: '',
    toStationId: '',
    updatedAt: '',
    // paymentMethod: 0,
    isCOD: false,
    shippingFee: 5000,
    distanceFee: 0,
    surCharge: 0,
    notes: '',
    ...order,
  } as Order;
  return (
    <Page title={isEdit ? t('order.titleEdit') : t('order.titleAdd')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isEdit ? t('order.titleEdit') : t('order.titleAdd')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('order.list'), href: PATH_DASHBOARD.order.root },
            {
              name: isEdit ? order?.orderCode || '' : t('order.titleAdd'),
            },
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              {(!isEdit || Boolean(order)) && (
                // <OrderForm
                //   initialValue={initialValues}
                //   onSubmit={handelStoreFormSubmit}
                //   isEdit={isEdit}
                //   isView={false}
                // />
                <OrderFormV2
                  initialValue={initialValues}
                  onSubmit={handelStoreFormSubmit}
                  isEdit={isEdit}
                  isView={false}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
