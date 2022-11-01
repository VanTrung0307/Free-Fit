import { Box, Button, Card, Grid, Stack, Typography, Autocomplete, TextField } from '@mui/material';
import { AutoCompleteField } from 'components/form';
import { LoadingButton } from '@mui/lab';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import InputField from 'components/FormField/InputField';
import SelectField from 'components/FormField/SelectField';
import { Address, PostStore } from 'models';
import { useForm, useFormState, Controller, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import { MapDraggable, SearchAddress, useDebouncedCallback } from 'components/common';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputAreaField from 'components/FormField/InputAreaField';
import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import { PATH_DASHBOARD } from 'routes/paths';
import { useNavigate, useLocation } from 'react-router';
import { styled } from '@mui/material/styles';
import Images from 'constants/image';
import { IconMyStore } from 'components/map/MarkerStyles';
import ImageForm from 'components/ImageForm';
import {
  selectStoreTypeOptions,
  selectBrandTypeOptions,
  storeActions,
  selectProvincesOptions,
  selectDistrictsOptions,
  selectWardsOptions,
  selectCampusesOptions,
  selectBuildingsOptions,
  selectBuilding,
} from '../storeSlice';

interface StoreFormProps {
  initialValue: PostStore;
  onSubmit?: (formValue: PostStore) => void;
  isEdit: boolean;
  isView?: boolean;
}
const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 300,
  height: 300,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm,
}));
export default function StoreForm({ initialValue, onSubmit, isEdit, isView }: StoreFormProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const locations = useLocation();

  const [imgLink, setImglink] = useState<string>(initialValue.imageUrl || Images.DEFAULT_IMG);
  const [address, setAddress] = useState(['']);
  const [location, setLocation] = useState<LatLngExpression>();
  const [provinceId, setProvinceId] = useState(0);
  const [districtId, setDistrictId] = useState(0);
  const [wardId, setWardId] = useState(0);
  const [campusId, setCampusId] = useState(0);

  useEffect(() => {
    dispatch(storeActions.fetchBrandType());
    dispatch(storeActions.fetchDistrictByProvince(provinceId));
    dispatch(storeActions.fetchWardByDistrict(districtId));
    dispatch(storeActions.fetchCampusByWard(wardId));
    dispatch(storeActions.fetchBuildingByCampus(campusId));
  }, [dispatch, provinceId, districtId, wardId, campusId]);

  // schema
  const schema = yup.object().shape({
    name: yup.string().required(t('store.errorStoreName')),
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

  const allBuildingsOptions = useAppSelector(selectBuilding);
  // const allBuildingOptions = new {
  //   label: allBuildingsOptions.name,
  //   id: allBuildingsOptions.id,
  // }();
  // const getAllBuildingObj = (option: any) => {
  //   if (!option) return option;
  //   if (!option.value) return allBuildingOptions.find((opt) => opt.value === option);
  //   return option;
  // };

  const handelFormSubmit = (formValues: PostStore) => {
    if (onSubmit) onSubmit(formValues);
  };
  const handelInputFieldImgChange = useDebouncedCallback((e) => {
    setImglink(e.target.value);
  }, 500);

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
  const handelSelectLocation = (address: Address) => {
    setLocation(address?.latlng);
  };
  const handelOnDragMarker = (point: any) => {
    // setLocationSelected(point['lng'].toString() + ' ' + point['lat'].toString());
    const latLng: LatLngExpression = [point.lat, point.lng];
    setLocation(latLng);
  };

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
  return (
    <FormProvider {...formMethod}>
      <form onSubmit={handleSubmit(handelFormSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom marginBottom={2}>
                  {t('store.info')}
                </Typography>
                <Stack spacing={2}>
                  <Stack spacing={2}>
                    <Box
                      style={{
                        display: 'flex',
                        flexFlow: 'row nowrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '10px',

                        height: '25.5vh',
                        width: '100%',
                      }}
                      mt={3}
                      mb={3}
                    >
                      <Controller
                        control={control}
                        name="imageUrl"
                        render={({ field }) => (
                          <ImageForm {...field} value={field.value} title="Ảnh bìa" />
                        )}
                      />
                    </Box>
                  </Stack>
                  <InputField
                    name="storeCode"
                    label={`${t('store.storeCode')}*`}
                    control={control}
                    disabled={isView}
                  />
                  <InputField
                    name="name"
                    label={`${t('store.storeName')}*`}
                    control={control}
                    disabled={isView}
                  />
                  <InputField
                    name="phone"
                    label={`${t('store.phone')}`}
                    control={control}
                    disabled={isView}
                  />
                  <InputField
                    name="bank"
                    label={`${t('store.bank')}`}
                    control={control}
                    disabled={isView}
                  />
                  <Box mt={2}>
                    <SelectField
                      name="storeTypeId"
                      label={`${t('store.storeTypeName')}*`}
                      control={control}
                      options={storeTypeOptions}
                      disabled={isView}
                    />
                  </Box>
                  <AutoCompleteField
                    options={brandOptions}
                    getOptionLabel={(value: any) => getBrandObj(value)?.label || ''}
                    isOptionEqualToValue={(option: any, value: any) => {
                      if (!option) return option;
                      return option.value === getBrandObj(value)?.value;
                    }}
                    transformValue={(opt: any) => opt?.value}
                    size="small"
                    type="text"
                    label={'Chọn thương hiệu'}
                    name={'brandId'}
                    fullWidth
                  />
                  <InputField
                    name="imageUrl"
                    label={`${t('store.img')}*`}
                    control={control}
                    onChange={handelInputFieldImgChange}
                    disabled={isView}
                  />
                  <Autocomplete
                    disablePortal
                    id="provinceId"
                    options={provinceOptions}
                    renderInput={(params) => <TextField {...params} label="Chọn tỉnh" />}
                    onChange={(event, newValue: any) => {
                      handelSelectProvince(newValue?.value);
                      handelInputFieldAddress(newValue?.label);
                    }}
                  />
                  <Autocomplete
                    disablePortal
                    id="districtId"
                    options={districtOptions}
                    renderInput={(params) => <TextField {...params} label="Chọn quận" />}
                    onChange={(event, newValue: any) => {
                      handelSelectDistrict(newValue?.value);
                      handelInputFieldAddress(newValue?.label);
                    }}
                  />
                  <Autocomplete
                    disablePortal
                    id="wardId"
                    options={wardOptions}
                    renderInput={(params) => <TextField {...params} label="Chọn phường" />}
                    onChange={(event, newValue: any) => {
                      handelSelectWard(newValue?.value);
                      handelInputFieldAddress(newValue?.label);
                    }}
                  />
                  <Autocomplete
                    disablePortal
                    id="campusId"
                    options={campusOptions}
                    renderInput={(params) => <TextField {...params} label="Chọn khu vực" />}
                    onChange={(event, newValue: any) => {
                      handelSelectCampus(newValue?.value);
                      handelInputFieldAddress(newValue?.label);
                    }}
                  />
                  <AutoCompleteField
                    options={buildingOptions}
                    getOptionLabel={(value: any) => getBuildingObj(value)?.label || ''}
                    isOptionEqualToValue={(option: any, value: any) => {
                      if (!option) return option;
                      return option.value === getBuildingObj(value)?.value;
                    }}
                    transformValue={(opt: any) => opt?.value}
                    size="small"
                    type="text"
                    label={'Chọn địa điểm'}
                    name={'buildingId'}
                    onUpdate={(newValue) => handelInputFieldAddress(newValue?.label)}
                    fullWidth
                  />
                </Stack>
              </Card>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom marginBottom={2}>
                {t('store.addressMap')}
              </Typography>
              <Stack spacing={2}>
                <SearchAddress onChangeAddress={handelSelectLocation} />

                <MapDraggable
                  location={location}
                  onDraggable={handelOnDragMarker}
                  icon={IconMyStore}
                />

                <InputField
                  name="coordinateString"
                  label={`${t('store.location')}*`}
                  control={control}
                  disabled
                />
                <InputAreaField
                  name="address"
                  label={`${t('store.address')}*`}
                  control={control}
                  disabled={isView}
                />
              </Stack>
            </Card>
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
                  marginTop: '16px',
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    navigate(`${PATH_DASHBOARD.store.root}`);
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
