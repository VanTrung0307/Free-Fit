import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppSelector } from 'app/hooks';
import InputField from 'components/FormField/InputField';
import SelectField, { SelectOptions } from 'components/FormField/SelectField';
import { selectStoresOptions } from 'features/store-management/storeSlice';
import { Asset, GetAssetType } from 'models';
import * as React from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import { PATH_DASHBOARD } from 'routes/paths';
import { useNavigate } from 'react-router';

interface AssetFormProps {
  initialValue: Asset;
  onSubmit?: (formValue: Asset) => void;
  isEdit: boolean;
  isView: boolean;
}

export default function AssetForm({ initialValue, onSubmit, isEdit, isView }: AssetFormProps) {
  const { t } = useTranslation();
  // schema
  const schema = yup.object().shape({
    name: yup.string().required(t('asset.errorName')),
    type: yup
      .number()
      .typeError(t('common.isRequired'))
      .moreThan(0, t('asset.errorType'))
      .required(t('asset.errorType')),
    storeId: yup
      .number()
      .typeError(t('common.isRequired'))
      .moreThan(0, t('asset.errorStore'))
      .required(t('asset.errorStore')),
    licencePlate: yup.string().required(t('common.isRequired')),
    color: yup.string().required(t('common.isRequired')),
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<any>({
    defaultValues: initialValue,
    resolver: yupResolver(schema),
  });
  const { isDirty } = useFormState({ control });
  const storeOptions = useAppSelector(selectStoresOptions);
  const navigate = useNavigate();
  const { typeAssetFilter } = GetAssetType();
  const handelFormSubmit = (formValues: Asset) => {
    if (onSubmit) onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      {!isView && (
        <Typography variant="h6" gutterBottom marginBottom={2}>
          {t('asset.infoAsset')}
        </Typography>
      )}
      <Stack spacing={2}>
        {isView && (
          <InputField name="id" label={`${t('asset.code')}*`} control={control} disabled={isView} />
        )}

        <InputField name="name" label={`${t('asset.name')}*`} control={control} disabled={isView} />
        <InputField
          name="color"
          label={`${t('agent.color')}*`}
          control={control}
          disabled={isView}
        />
        <InputField
          name="transportDescription"
          label={t('agent.transportDescription')}
          control={control}
          disabled={isView}
        />
        <InputField
          name="licencePlate"
          label={`${t('agent.licencePlate')}*`}
          control={control}
          disabled={isView}
        />
        <Box mt={2}>
          <SelectField
            name="type"
            label={`${t('asset.type')}*`}
            control={control}
            options={typeAssetFilter as SelectOptions[]}
            disabled={isView}
          />
        </Box>

        <Box mt={2}>
          <SelectField
            name="storeId"
            label={`${t('asset.storeName')}*`}
            control={control}
            options={storeOptions}
          />
        </Box>
      </Stack>
      {!isView && (
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
              navigate(`${PATH_DASHBOARD.asset.assets}`);
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
    </form>
  );
}
