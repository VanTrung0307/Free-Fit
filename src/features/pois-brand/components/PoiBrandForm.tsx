import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import InputAreaField from 'components/FormField/InputAreaField';
import InputField from 'components/FormField/InputField';
import { PostPoiBrand } from 'models';
import * as React from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import * as yup from 'yup';
import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';

interface PoiBrandFormProps {
  initialValue: PostPoiBrand;
  onSubmit?: (formValue: PostPoiBrand) => void;
  isEdit: boolean;
}

export default function PoiBrandForm({ initialValue, onSubmit, isEdit }: PoiBrandFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // schema
  const schema = yup.object().shape({
    alias: yup.string().required(t('store.errorAlias')),
    notes: yup.string().notRequired(),
    brandPoiCode: yup.string().required(t('store.errorStoreCode')),
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
  const handelFormSubmit = (formValues: PostPoiBrand) => {
    if (onSubmit) onSubmit(formValues);
  };
  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Stack spacing={2}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom marginBottom={2}>
            {t('poi.infoPoi')}
          </Typography>
          <Stack spacing={2}>
            <InputField name="alias" label={`${t('poi.alias')}*`} control={control} />
            <InputField name="brandPoiCode" label={`${t('poi.poiCode')}*`} control={control} />
            <InputAreaField name="notes" label={t('poi.note')} control={control} />
          </Stack>
        </Card>
        {/* <LoadingButton
          disabled={!isDirty}
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {isEdit ? t('common.btnUpdate') : t('common.btnSubmit')}
        </LoadingButton> */}
      </Stack>
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
            navigate(`${PATH_DASHBOARD.poiBrand.root}`);
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
    </form>
  );
}
