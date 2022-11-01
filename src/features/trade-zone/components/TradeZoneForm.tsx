import { yupResolver } from '@hookform/resolvers/yup';
import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppSelector } from 'app/hooks';
import InputField from 'components/FormField/InputField';
import { selectStoreEmptyTz, selectStoresOptions } from 'features/store-management/storeSlice';
import { PostTradeZone, StoresName } from 'models';
import { useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import * as yup from 'yup';
import RadioGroupFieldTimeInDay from 'components/FormField/RadioGroupFieldTimeInDay';
import { OptionsTimeFilter } from 'models/dto/timeFilter';
import RadioGroupFieldDayInWeek from 'components/FormField/RadioGroupFieldDayInWeek';
import MultiCheckBoxField from 'components/FormField/MultiCheckBoxField';
import { makeStyles } from '@mui/styles';
import MultiCheckView from 'components/common/MultiCheckView';
import { selectFreeZoneOptions } from '../tradeZoneSlice';

interface TradeZoneFormProps {
  initialValue: PostTradeZone;
  onSubmit?: (formValue: PostTradeZone) => void;
  isEdit: boolean;
  listPost: number[];
}
const useStyle = makeStyles((theme) => ({
  boxFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'left',
    textAlign: 'left',
    flexDirection: 'column',
  },
}));

export default function TradeZoneForm({
  initialValue,
  onSubmit,
  isEdit,
  listPost,
}: TradeZoneFormProps) {
  const { t } = useTranslation();
  // schema
  const schema = yup.object().shape({
    name: yup.string().required(t('tz.errorNameTz')),
    stores: yup
      .array()
      .min(1, t('common.isRequiredOptions'))
      .required(t('common.isRequiredOptions')),
  });
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<any>({
    defaultValues: initialValue,
    resolver: yupResolver(schema),
  });
  const { isDirty } = useFormState({ control });

  const navigate = useNavigate();
  const fzOptions = useAppSelector(selectFreeZoneOptions);
  const selectedBox = fzOptions.filter(({ id }) => listPost.includes(id));
  const storeOptions = useAppSelector(selectStoreEmptyTz);
  const classes = useStyle();

  const handelFormSubmit = (formValues: PostTradeZone) => {
    formValues.listZoneId = [...selectedBox.map((e) => e.id)];
    if (onSubmit) onSubmit(formValues);
  };
  const renderStores = () => {
    if (!isEdit) {
      return (
        <>
          <Box mt={2} />
          <MultiCheckBoxField
            name="stores"
            label={`${t('tz.storesApply')}*`}
            control={control}
            options={(storeOptions as OptionsTimeFilter[]) || []}
            isRow={true}
            getValues={getValues}
            setValue={setValue}
            xs={6}
            lg={6}
            md={6}
          />
        </>
      );
    }
    return (
      <Box mb={1} className={classes.boxFlex}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }} component="span">
          {t('tz.storesApply')}&nbsp;:&nbsp;
        </Typography>
        <Chip
          key={initialValue.stores[0].id}
          variant="outlined"
          icon={<StorefrontIcon />}
          label={initialValue.stores[0].name}
          color="primary"
          // size="small"
          style={{ marginRight: '4px', marginTop: '8px' }}
        />
      </Box>
    );
  };

  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Stack spacing={2}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom marginBottom={2}>
            {t('tz.infoTz')}
          </Typography>
          <Stack spacing={2}>
            <InputField name="name" label={`${t('tz.name')}*`} control={control} />
            {/* <Autocomplete
              fullWidth
              multiple
              limitTags={20}
              id="multiple-limit-tags"
              options={fzOptions}
              getOptionLabel={(option) => option.name}
              defaultValue={[]}
              value={selectedBox}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label={t('groupZone.selected')} />
              )}
            /> */}
            <Box mt={2} />
            <MultiCheckView
              xs={4}
              md={3}
              lg={3}
              options={fzOptions as OptionsTimeFilter[]}
              value={selectedBox as OptionsTimeFilter[]}
              isRow={true}
              label={t('groupZone.selected')}
              limit={10}
            />
            {!isEdit && storeOptions.length === 0 ? (
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
              renderStores()
            )}
          </Stack>
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
                navigate(`${PATH_DASHBOARD.tradeZone.tradeZones}`);
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
        </Card>
      </Stack>
    </form>
  );
}
