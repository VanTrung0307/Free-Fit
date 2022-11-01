import { yupResolver } from '@hookform/resolvers/yup';
import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppSelector } from 'app/hooks';
import { MapDraggable, SearchAddress } from 'components/common';
import AutoCompleteField from 'components/FormField/AutoCompleteField';
import InputField from 'components/FormField/InputField';
import { IcMarkerLocation } from 'components/map/MarkerStyles';
import { selectAgentOptions } from 'features/agent/agentSlice';
import { selectOrderOptions } from 'features/order/orderSlice';
import { LatLngExpression } from 'leaflet';
import { Address, NominatimAddress, PostTask } from 'models';
import { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { getAddressDataByLatLngUtils } from 'utils/common';
import * as yup from 'yup';

interface TaskFormProps {
  initialValue: PostTask;
  onSubmit?: (formValue: PostTask) => void;
  isView?: boolean;
  isEdit: boolean;
}

export default function TaskForm({ initialValue, onSubmit, isView, isEdit }: TaskFormProps) {
  const { t } = useTranslation();
  // schema
  const schema = yup.object().shape({
    orderOptions: yup
      .array()
      .min(1, t('common.isRequiredOptions'))
      .required(t('common.isRequiredOptions')),
    agentOptions: yup
      .array()
      .min(1, t('common.isRequiredOptions'))
      .required(t('common.isRequiredOptions')),
    startDepot: yup.object().shape({
      longitude: yup.string().required(t('common.isRequired')),
      latitude: yup.string().required(t('common.isRequired')),
      address: yup.string().required(t('common.isRequired')),
      district: yup.string().required(t('common.isRequired')),
      ward: yup.string().required(t('common.isRequired')),
      city: yup.string().required(t('common.isRequired')),
    }),
    capacity: yup
      .number()
      .typeError(t('common.isRequired'))
      .positive(t('common.isNumberPositive'))
      .required(t('common.isRequired')),
  });
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<any>({
    defaultValues: initialValue,
    // resolver: yupResolver(schema),
  });
  const { isDirty } = useFormState({ control });
  const agentOptions = useAppSelector(selectAgentOptions);
  const ordersOption = useAppSelector(selectOrderOptions);
  const navigate = useNavigate();
  const [location, setLocation] = useState<LatLngExpression>();
  //
  useEffect(() => {
    if (isView) {
      const lat = getValues('startDepot.latitude');
      const lng = getValues('startDepot.longitude');
      setLocation([Number(lat), Number(lng)] as LatLngExpression);
    }
  }, [getValues, isView]);
  useEffect(() => {
    if (isView) return;
    if (!location) return;
    setValue('startDepot.latitude', location[0].toString(), {
      shouldDirty: true,
    });
    setValue('startDepot.longitude', location[1].toString(), {
      shouldDirty: true,
    });
    getAddressDataByLatLng(location[0], location[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, setValue]);
  const getAddressDataByLatLng = async (lat: number, lng: number) => {
    const data: NominatimAddress = await getAddressDataByLatLngUtils(lat, lng);
    setValue('startDepot.address', data.display_name || '', {
      shouldDirty: true,
    });
    setValue('startDepot.district', data.address.town || data.address.county || '', {
      shouldDirty: true,
    });
    setValue(
      'startDepot.ward',
      data.address.quarter || data.address.suburb || data.address.village || '',
      {
        shouldDirty: true,
      }
    );
    setValue('startDepot.city', data.address.city || data.address.state || '', {
      shouldDirty: true,
    });
    //
  };
  const handelSelectLocation = (address: Address) => {
    setLocation(address?.latlng);
  };
  const handelOnDragMarker = (point: any) => {
    if (!isView) {
      const latLng: LatLngExpression = [point.lat, point.lng];
      setLocation(latLng);
    }
  };

  const handelAgentSelected = (e, value) => {
    setValue('orderOptions', value, {
      shouldDirty: true,
    });
  };
  const handelOrderSelected = (e, value) => {
    setValue('agentOptions', value, {
      shouldDirty: true,
    });
  };
  const handelFormSubmit = (formValues: PostTask) => {
    if (onSubmit) onSubmit(formValues);
  };
  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom marginBottom={2}>
              {t('task.info')}
            </Typography>
            <Stack spacing={2}>
              <AutoCompleteField
                control={control}
                name="orderOptions"
                options={ordersOption}
                label={`${t('common.order')}*`}
                onChange={handelAgentSelected}
              />
              <AutoCompleteField
                control={control}
                name="agentOptions"
                options={agentOptions}
                label={`${t('task.agents')}*`}
                onChange={handelOrderSelected}
              />
              <InputField
                name="capacity"
                label={`${t('task.capacity')}*`}
                control={control}
                type="number"
                disabled={isView}
              />
              <Typography variant="h6" gutterBottom marginBottom={2}>
                {t('task.depot')}
              </Typography>
              <InputField
                name="startDepot.latitude"
                label={`${t('common.lat')}*`}
                control={control}
                disabled={true}
              />
              <InputField
                name="startDepot.longitude"
                label={`${t('common.lng')}*`}
                control={control}
                disabled={true}
              />
              <InputField
                name="startDepot.address"
                label={`${t('store.address')}*`}
                control={control}
                disabled={isView}
              />
              <InputField
                name="startDepot.city"
                label={`${t('adminLevel.province')}*`}
                control={control}
                disabled={isView}
              />
              <InputField
                name="startDepot.district"
                label={`${t('adminLevel.district')}*`}
                control={control}
                disabled={isView}
              />
              <InputField
                name="startDepot.ward"
                label={`${t('adminLevel.ward')}*`}
                control={control}
                disabled={isView}
              />
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom marginBottom={2}>
              {t('order.latLng')}
            </Typography>
            <Stack spacing={2}>
              <Box>
                {!isView && <SearchAddress onChangeAddress={handelSelectLocation} />}
                <Box mt={2}>
                  <MapDraggable
                    location={location}
                    onDraggable={handelOnDragMarker}
                    icon={IcMarkerLocation}
                  />
                </Box>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
      {isView ? (
        <></>
      ) : (
        <Box
          style={{
            display: 'flex',
            flexFlow: 'row nowrap',
            justifyContent: 'flex-end',
            alignContent: 'center',
            backgroundColor: '#fff',
            marginTop: '15px',
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              navigate(`${PATH_DASHBOARD.task.root}`);
            }}
            startIcon={<Icon icon={arrowCircleLeftOutline} />}
            style={{ marginRight: '15px' }}
            size="medium"
          >
            {t('content.backHomePage')}
          </Button>
          <LoadingButton
            type="submit"
            disabled={!isDirty}
            variant="contained"
            size="medium"
            loading={isSubmitting}
            startIcon={<Icon icon={saveFill} />}
          >
            {isEdit ? t('common.btnUpdate') : t('common.btnSubmit')}
          </LoadingButton>
        </Box>
        // <LoadingButton
        //   disabled={!isDirty}
        //   type="submit"
        //   fullWidth
        //   variant="contained"
        //   size="large"
        //   loading={isSubmitting}
        // >
        //   {t('common.btnUpdate')}
        // </LoadingButton>
      )}
    </form>
  );
}
