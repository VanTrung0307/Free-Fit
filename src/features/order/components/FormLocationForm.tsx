import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { MapDraggable, SearchAddress } from 'components/common';
import InputField from 'components/FormField/InputField';
import { IcMarkerLocation } from 'components/map/MarkerStyles';
import { LatLngExpression } from 'leaflet';
import { Address, NominatimAddress } from 'models';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getAddressDataByLatLngUtils } from 'utils/common';

interface FormLocationFormProps {
  isView: boolean;
}

export const FormLocationForm = ({ isView }: FormLocationFormProps) => {
  const { t } = useTranslation();
  const methods = useFormContext();
  const [location, setLocation] = useState<LatLngExpression>();
  const { control, setValue, getValues } = methods;
  useEffect(() => {
    if (isView) {
      const lat = getValues('fromStation.latitude');
      const lng = getValues('fromStation.longitude');
      setLocation([Number(lat), Number(lng)] as LatLngExpression);
    }
  }, [getValues, isView]);
  useEffect(() => {
    if (isView) return;
    if (!location) return;
    setValue('fromStation.latitude', location[0].toString(), {
      shouldDirty: true,
    });
    setValue('fromStation.longitude', location[1].toString(), {
      shouldDirty: true,
    });
    getAddressDataByLatLng(location[0], location[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, setValue]);
  const getAddressDataByLatLng = async (lat: number, lng: number) => {
    const data: NominatimAddress = await getAddressDataByLatLngUtils(lat, lng);
    setValue('fromStation.address', data.display_name || '', {
      shouldDirty: true,
    });
    setValue('fromStation.district', data.address.town || data.address.county || '', {
      shouldDirty: true,
    });
    setValue(
      'fromStation.ward',
      data.address.quarter || data.address.suburb || data.address.village || '',
      {
        shouldDirty: true,
      }
    );
    setValue('fromStation.city', data.address.city || data.address.state || '', {
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom marginBottom={2}>
            {t('order.startInfo')}
          </Typography>
          <Stack spacing={2}>
            <InputField
              name="fromStation.latitude"
              label={`${t('common.lat')}*`}
              control={control}
              disabled={true}
            />
            <InputField
              name="fromStation.longitude"
              label={`${t('common.lng')}*`}
              control={control}
              disabled={true}
            />
            <InputField
              name="fromStation.address"
              label={`${t('store.address')}*`}
              control={control}
              disabled={isView}
            />
            <InputField
              name="fromStation.city"
              label={`${t('adminLevel.province')}*`}
              control={control}
              disabled={isView}
            />
            <InputField
              name="fromStation.district"
              label={`${t('adminLevel.district')}*`}
              control={control}
              disabled={isView}
            />
            <InputField
              name="fromStation.ward"
              label={`${t('adminLevel.ward')}*`}
              control={control}
              disabled={isView}
            />
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
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
  );
};
