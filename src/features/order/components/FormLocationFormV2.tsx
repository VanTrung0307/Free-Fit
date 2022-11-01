import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { MapDraggable, SearchAddress, useDebouncedCallback } from 'components/common';
import { AutoCompleteField, SelectField } from 'components/form';
import InputField from 'components/FormField/InputField';
import { IcMarkerLocation } from 'components/map/MarkerStyles';
import { LatLngExpression } from 'leaflet';
import { Account, Address, NominatimAddress, PostAccount } from 'models';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getAddressDataByLatLngUtils } from 'utils/common';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import accountApi from 'api/accountApi';
import {
  selectFilter,
  selectLoading,
  selectStoresResponse,
  storeActions,
  selectBrandTypeOptions,
  selectProvincesOptions,
  selectStoreTypeOptions,
  selectStoreResponse,
} from '../../store-management/storeSlice';

interface FormLocationFormProps {
  isView: boolean;
}

export const FormLocationFormV2 = ({ isView }: FormLocationFormProps) => {
  const { t } = useTranslation();
  const [address, setAddress] = useState(['']);
  const [account, setAccount] = useState<PostAccount>();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  useEffect(() => {
    dispatch(storeActions.fetchStore());
    (async () => {
      try {
        const data = await accountApi.getAll();
        console.log(data);
        const newValue: PostAccount = {
          fullname: data[0]?.fullname || '',
          phoneNumber: data[0]?.phoneNumber || '',
          email: data[0]?.email || '',
          role: 1,
          imageUrl: data[0]?.imageUrl || '',
          brandId: data[0]?.brandId || 0,
          password: '',
        };
        setAccount(newValue);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, [dispatch]);
  const storeOptions = useAppSelector(selectStoreResponse);
  const storeOption = storeOptions?.map((c) => ({
    label: c.name,
    value: c.id,
    address: c.address,
  }));
  const getStoreObj = (option: any) => {
    if (!option) return option;
    if (!option.value) return storeOption.find((opt) => opt.value === option);
    return option;
  };
  const methods = useFormContext();
  const [location, setLocation] = useState<LatLngExpression>();
  const { control, setValue, getValues, watch } = methods;
  const useWatch = watch();
  console.log(useWatch);
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

  const handelInputFieldAddress = useDebouncedCallback((value) => {
    setValue('fromStation.address', value);
  }, 500);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom marginBottom={2}>
            {t('order.startInfo')}
          </Typography>
          <Stack spacing={2}>
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
              name={'fromStation'}
              fullWidth
              onChange={(index, newValue: any) => {
                console.log(newValue);
                setValue('fromStation', newValue?.value);
                setValue('fromStation.code', newValue?.label);
                handelInputFieldAddress(newValue?.address);
              }}
            />
            <InputField name="fromStation.address" label={`Địa chỉ`} control={control} />
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
};
