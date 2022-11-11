import { yupResolver } from '@hookform/resolvers/yup';
import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useDebouncedCallback } from 'components/common';
import InputField from 'components/FormField/InputField';
import { Dayjs } from 'dayjs';
import { LatLngExpression } from 'leaflet';
import { PostClub } from 'models/freefit/club';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import * as yup from 'yup';
import {
  clubActions,
  selectBrandTypeOptions,
  selectBuildingsOptions,
  selectCampusesOptions,
  selectDistrictsOptions,
  selectProvincesOptions,
  selectStoreTypeOptions,
  selectWardsOptions,
} from '../storeSlice';

interface ClubFormProps {
  initialValue: PostClub;
  onSubmit?: (formValue: PostClub) => void;
  isEdit: boolean;
  isView?: boolean;
}
export default function ClubForm({ initialValue, onSubmit, isEdit, isView }: ClubFormProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState(['']);
  const [location, setLocation] = useState<LatLngExpression>();
  const [provinceId, setProvinceId] = useState(0);
  const [districtId, setDistrictId] = useState(0);
  const [wardId, setWardId] = useState(0);
  const [campusId, setCampusId] = useState(0);

  useEffect(() => {
    dispatch(clubActions.fetchBrandType());
    dispatch(clubActions.fetchDistrictByProvince(provinceId));
    dispatch(clubActions.fetchWardByDistrict(districtId));
    dispatch(clubActions.fetchCampusByWard(wardId));
    dispatch(clubActions.fetchBuildingByCampus(campusId));
  }, [dispatch, provinceId, districtId, wardId, campusId]);

  // schema
  const schema = yup.object().shape({
    // name: yup.string().required(t('store.errorStoreName')),
    address: yup.string().required('Bạn cần nhập đầy đủ'),
    area: yup.string().required('Bạn cần nhập đầy đủ'),
    managerName: yup.string().required('Bạn cần nhập đầy đủ'),
    // imageUrl: yup.string().required(t('store.errorImg')),
    // coordinateString: yup.string().required(t('store.errorLocation')),
    // address: yup.string().required(t('store.errorAddress')),
    // storeCode: yup.string().required(t('store.errorStoreCode')),
    // storeTypeId: yup
    //   .number()
    //   .typeError(t('common.isRequired'))
    //   .moreThan(0, t('store.errorStoreType'))
    //   .required(t('store.errorStoreType')),
  });
  const formMethod = useForm<any>({
    defaultValues: initialValue,
    resolver: yupResolver(schema),
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = formMethod;
  const { isDirty } = useFormState({ control });

  const storeTypeOptions = useAppSelector(selectStoreTypeOptions);
  const brandTypeOptions = useAppSelector(selectBrandTypeOptions);
  const brandOptions = brandTypeOptions.map((c) => ({ label: c.name, value: c.id }));
  const getBrandObj = (option: any) => {
    if (!option) return option;
    if (!option.value) return brandOptions.find((opt) => opt.value === option);
    return option;
  };

  const provincesOptions = useAppSelector(selectProvincesOptions);
  const provinceOptions = provincesOptions.map((c) => ({ label: c.name, value: c.id }));

  const districtsOptions = useAppSelector(selectDistrictsOptions);
  const districtOptions = districtsOptions.map((c) => ({ label: c.name, value: c.id }));

  const wardsOptions = useAppSelector(selectWardsOptions);
  const wardOptions = wardsOptions.map((c) => ({ label: c.name, value: c.id }));

  const campusesOptions = useAppSelector(selectCampusesOptions);
  const campusOptions = campusesOptions.map((c) => ({ label: c.name, value: c.id }));

  const buildingsOptions = useAppSelector(selectBuildingsOptions);
  const buildingOptions = buildingsOptions.map((c) => ({ label: c.name, value: c.id }));
  const getBuildingObj = (option: any) => {
    if (!option) return option;
    if (!option.value) return buildingOptions.find((opt) => opt.value === option);
    return option;
  };

  const handelFormSubmit = (formValues: PostClub) => {
    if (onSubmit) onSubmit(formValues);
  };

  const handelInputFieldAddress = useDebouncedCallback((value) => {
    // setAddress((prevState) => `${value}, ${prevState}`);
    const addAddress = [...address];
    addAddress.unshift(value);
    setAddress(addAddress);
    if (!isEdit) {
      setValue('address', addAddress.join(', '));
    }
  }, 500);

  useEffect(() => {
    if (!location) return;
    setValue('coordinateString', `${location[1].toString()} ${location[0].toString()}`, {
      shouldDirty: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handelSelectProvince = (id) => {
    setProvinceId(id);
  };
  const handelSelectDistrict = (id) => {
    setDistrictId(id);
  };
  const handelSelectWard = (id) => {
    setWardId(id);
  };
  const handelSelectCampus = (id) => {
    setCampusId(id);
  };
  const [day, setDay] = React.useState<Dayjs | null>(null);
  return (
    <FormProvider {...formMethod}>
      <form onSubmit={handleSubmit(handelFormSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom marginBottom={2}>
                  {'Thông tin Phòng tập'}
                </Typography>
                <Stack spacing={2}>
                  <InputField
                    name="address"
                    label={`${'Địa chỉ Phòng Tập'}*`}
                    control={control}
                    disabled={isView}
                  />

                  <InputField name="area" label={'Khu vực'} control={control} disabled={isView} />
                  <InputField
                    name="managerName"
                    label={'Người quản lý'}
                    control={control}
                    disabled={isView}
                  />
                </Stack>
              </Card>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            {isView ? (
              <></>
            ) : (
              <Box
                style={{
                  display: 'flex',
                  flexFlow: 'row nowrap',
                  justifyContent: 'flex-end',
                  alignContent: 'center',
                  backgroundColor: 'dark',
                  marginTop: '16px',
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    navigate(`${PATH_DASHBOARD.club.root}`);
                  }}
                  size="medium"
                  startIcon={<Icon icon={arrowCircleLeftOutline} />}
                  style={{ marginRight: '15px' }}
                >
                  {t('content.backHomePage')}
                </Button>
                <LoadingButton
                  disabled={!isDirty}
                  loading={isSubmitting}
                  type="submit"
                  variant="contained"
                  size="medium"
                  startIcon={<Icon icon={saveFill} />}
                >
                  {isEdit ? t('common.btnUpdate') : t('common.btnSubmit')}
                </LoadingButton>
              </Box>
            )}
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}
