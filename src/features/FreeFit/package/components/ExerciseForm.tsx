import { Autocomplete, Box, Button, Card, Grid, Stack, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import InputField from 'components/FormField/InputField';
import { PostStore } from 'models';
import { useForm, Controller, FormProvider, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ImageForm from 'components/ImageForm';
import { Dayjs } from 'dayjs';
import * as React from 'react';
import { Icon } from '@iconify/react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LoadingButton, LocalizationProvider } from '@mui/lab';
import { useNavigate, useLocation } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { useDebouncedCallback } from 'components/common';
import Images from 'constants/image';
import { selectCampusesOptions, storeActions } from '../storeSlice';

interface StoreFormProps {
  initialValue: PostStore;
  onSubmit?: (formValue: PostStore) => void;
  isEdit: boolean;
  isView?: boolean;
}
export default function ExerciseForm({ initialValue, onSubmit, isEdit, isView }: StoreFormProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  const [address, setAddress] = useState(['']);
  const [imgLink, setImglink] = useState<string>(initialValue.imageUrl || Images.DEFAULT_IMG);
  const campusesOptions = useAppSelector(selectCampusesOptions);
  const campusOptions = campusesOptions.map((c) => ({ label: c.name, value: c.id }));
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
  const handelFormSubmit = (formValues: PostStore) => {
    if (onSubmit) onSubmit(formValues);
  };

  useEffect(() => {
    if (!location) return;
    setValue('coordinateString', `${location[1].toString()} ${location[0].toString()}`, {
      shouldDirty: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  const [day, setDay] = React.useState<Dayjs | null>(null);

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
                  {'Thông tin PT'}
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
                          <ImageForm {...field} value={field.value} title="Ảnh đại diện" />
                        )}
                      />
                    </Box>
                  </Stack>
                  <InputField
                    name="storeCode"
                    label={`${'Họ và tên'}*`}
                    control={control}
                    disabled={isView}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Ngày Sinh"
                      disabled={isView}
                      value={day}
                      onChange={(newValue) => {
                        setDay(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  {/* <InputField
                    name="name"
                    label={`${'Ngày sinh'}*`}
                    control={control}
                    disabled={isView}
                  /> */}
                  <InputField
                    name="phone"
                    label={`${t('store.phone')}`}
                    control={control}
                    disabled={isView}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Ngày Đăng Kí"
                      disabled={isView}
                      value={day}
                      onChange={(newValue) => {
                        setDay(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <InputField
                    name="email"
                    label={`${'Email'}`}
                    control={control}
                    disabled={isView}
                  />
                  {/* <InputField
                    name="adress"
                    label={`${'Chi nhánh'}`}
                    control={control}
                    disabled={isView}
                  /> */}
                  <Autocomplete
                    disablePortal
                    id="status"
                    options={campusOptions}
                    renderInput={(params) => <TextField {...params} label="Trạng thái" />}
                    onChange={(event, newValue: any) => {
                      handelSelectCampus(newValue?.value);
                      handelInputFieldAddress(newValue?.label);
                    }}
                  />
                  <Autocomplete
                    disablePortal
                    id="campusId"
                    options={campusOptions}
                    renderInput={(params) => <TextField {...params} label="Chọn phòng" />}
                    onChange={(event, newValue: any) => {
                      handelSelectCampus(newValue?.value);
                      handelInputFieldAddress(newValue?.label);
                    }}
                  />
                  <Autocomplete
                    disablePortal
                    id="campusId"
                    options={campusOptions}
                    renderInput={(params) => <TextField {...params} label="Chọn thời gian" />}
                    onChange={(event, newValue: any) => {
                      handelSelectCampus(newValue?.value);
                      handelInputFieldAddress(newValue?.label);
                    }}
                  />
                </Stack>
              </Card>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} sx={{ paddingRight: '350px' }}>
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
                    navigate(`${PATH_DASHBOARD.pt.root}`);
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
