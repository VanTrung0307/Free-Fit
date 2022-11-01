import { yupResolver } from '@hookform/resolvers/yup';
import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import InputAreaField from 'components/FormField/InputAreaField';
import InputField from 'components/FormField/InputField';
import MultiCheckBoxField from 'components/FormField/MultiCheckBoxField';
import SelectField from 'components/FormField/SelectField';
import { selectGroupZoneOptions } from 'features/group-zone/groupZoneSlice';
import { selectStoreInGzOptions, storeActions } from 'features/store-management/storeSlice';
import { TzVersion } from 'models';
import { GetConstantTimeFilter, OptionsTimeFilter } from 'models/dto/timeFilter';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import * as yup from 'yup';

interface TzVersionProps {
  initialValue: TzVersion;
  onSubmit?: (formValue: TzVersion) => void;
  isView?: boolean;
  isEdit: boolean;
}

export default function TzVersionViewEditForm({
  initialValue,
  onSubmit,
  isView,
  isEdit,
}: TzVersionProps) {
  const { t } = useTranslation();
  // schema
  const schema = yup.object().shape({
    name: yup.string().required(t('store.errorStoreName')),
    description: yup.string().notRequired(),
    // dateFilter: yup.string().required(t('store.errorStoreName')),
    // timeSlot: yup.string().required(t('store.errorStoreName')),
    groupZoneId: yup
      .number()
      .moreThan(0, t('store.errorStoreType'))
      .required(t('common.isRequiredOptions')),
    dateOptions: yup
      .array()
      .min(1, t('common.isRequiredOptions'))
      .required(t('common.isRequiredOptions')),
    timeOptions: yup
      .array()
      .min(1, t('common.isRequiredOptions'))
      .required(t('common.isRequiredOptions')),
    storesName: yup
      .array()
      .min(1, t('common.isRequiredOptions'))
      .required(t('common.isRequiredOptions')),
  });
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting },
  } = useForm<any>({
    defaultValues: initialValue,
    resolver: yupResolver(schema),
  });
  const { isDirty } = useFormState({ control });
  const { timeFilterOptions, dateFilterOptions } = GetConstantTimeFilter();
  const navigate = useNavigate();
  const groupZoneOptions = useAppSelector(selectGroupZoneOptions);
  const handelFormSubmit = (formValues: TzVersion) => {
    if (onSubmit) onSubmit(formValues);
  };
  const storeOptions = useAppSelector(selectStoreInGzOptions);
  const watchFields = watch('groupZoneId');
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (Number(watchFields) === 0) return;

    dispatch(storeActions.fetchStoresInGz(Number(watchFields)));
  }, [dispatch, watchFields]);
  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      {isView && <Box mt={1} />}
      <Stack spacing={2}>
        {isView && <InputField name="id" label="#Id" control={control} disabled={isView} />}
        <InputField
          name="name"
          label={`${t('tz.tzVerName')}*`}
          control={control}
          disabled={isView}
        />
        <Box mt={2} />
        <MultiCheckBoxField
          name="dateOptions"
          label={`${t('tz.dateFilter')}*`}
          control={control}
          options={dateFilterOptions as OptionsTimeFilter[]}
          disabled={isView}
          isRow={true}
          getValues={getValues}
          setValue={setValue}
          xs={3}
          md={1}
          lg={1}
        />
        <MultiCheckBoxField
          name="timeOptions"
          label={`${t('tz.timeFilter')}*`}
          control={control}
          options={timeFilterOptions as OptionsTimeFilter[]}
          disabled={isView}
          isRow={true}
          getValues={getValues}
          setValue={setValue}
          xs={3}
          md={2}
          lg={2}
        />
        {!isView && (
          <>
            <Box mt={2} mb={2}>
              <SelectField
                name="groupZoneId"
                label={`${t('groupZone.name')}*`}
                control={control}
                options={groupZoneOptions}
                disabled={isView}
              />
            </Box>
            {storeOptions.length === 0 ? (
              <Paper
                sx={{
                  p: 3,
                  width: 1,
                  bgcolor: 'background.neutral',
                }}
              >
                <Typography variant="body1" gutterBottom color="red">
                  {t('tz.noteSelectStoreInGz')}
                </Typography>
                {/* {Boolean(errors.storeName?.message) && (
                  <Typography variant="body1" gutterBottom>
                    {t('tz.errorStoreSelect')}
                  </Typography>
                )} */}
              </Paper>
            ) : (
              <>
                <Box mt={2} />
                <MultiCheckBoxField
                  name="storesName"
                  label={`${t('tz.storesApply')}*`}
                  control={control}
                  options={(storeOptions as OptionsTimeFilter[]) || []}
                  disabled={isView}
                  isRow={true}
                  getValues={getValues}
                  setValue={setValue}
                  xs={3}
                  md={2}
                  lg={2}
                />
              </>
            )}
          </>
        )}
        {isView && (
          <>
            <Autocomplete
              fullWidth
              multiple
              defaultValue={[]}
              value={initialValue.storesName.map((el) => ({ id: el.id, name: el.name }))}
              // onChange={isView ? () => {} : handelTimeSelected}
              options={initialValue.storesName.map((el) => ({ id: el.id, name: el.name }))}
              disableCloseOnSelect
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} label={t('tz.storesApply')} />}
            />
            <InputField
              name="groupZoneName"
              label={t('groupZone.name')}
              control={control}
              disabled={isView}
            />
            <TextField
              fullWidth
              label={t('common.status')}
              value={initialValue.isActive ? t('tz.active') : t('tz.unActive')}
              disabled
            />
          </>
        )}

        <InputAreaField
          name="description"
          label={t('common.description')}
          control={control}
          disabled={isView}
        />
      </Stack>

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
            size="medium"
            onClick={() => {
              navigate(`${PATH_DASHBOARD.tradeZone.tradeZoneVersion}`);
            }}
            startIcon={<Icon icon={arrowCircleLeftOutline} />}
            style={{ marginRight: '16px' }}
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
      )}
    </form>
  );
}
