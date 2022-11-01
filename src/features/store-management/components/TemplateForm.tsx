import { yupResolver } from '@hookform/resolvers/yup';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import { Card, Grid, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import InputField from 'components/FormField/InputField';
import { PostTemplate, Template } from 'models';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

interface TemplateFormProps {
  initialValue: PostTemplate;
  storeName: string;
  // eslint-disable-next-line react/no-unused-prop-types
  selectedTemplateName: string;
  selectTemplate?: Template;
  onSubmit?: (formValue: PostTemplate) => void;
}

export default function TemplateForm({
  initialValue,
  onSubmit,
  storeName,
  selectTemplate,
}: TemplateFormProps) {
  const { t } = useTranslation();
  // schema
  const schema = yup.object().shape({
    url: yup.string().required(t('store.errorUrl')),
    templateId: yup
      .number()
      .moreThan(0, t('store.errorTemplate'))
      .required(t('store.errorTemplate')),
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<any>({
    defaultValues: initialValue,
    resolver: yupResolver(schema),
  });
  const { isDirty } = useFormState({ control });
  const handelFormSubmit = (formValues: PostTemplate) => {
    if (onSubmit) onSubmit(formValues);
  };
  useEffect(() => {
    if (!selectTemplate) return;
    setValue('templateId', selectTemplate.id, {
      shouldDirty: initialValue.templateId !== selectTemplate.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectTemplate]);
  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Stack spacing={2}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom marginBottom={2}>
            {`${t('store.storeName')}: ${storeName}`}
          </Typography>
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={6}>
                <InputField name="url" label={`${t('store.url')}*`} control={control} />
              </Grid>
              <Grid item xs={6} md={3} lg={3}>
                <TextField
                  fullWidth
                  label={t('store.selected')}
                  variant="outlined"
                  value={selectTemplate?.name || t('store.nonSelect')}
                  disabled
                  error={Boolean(errors.templateId?.message)}
                  helperText={errors.templateId?.message}
                />
              </Grid>
              <Grid item xs={6} md={3} lg={3}>
                <LoadingButton
                  disabled={!isDirty}
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="medium"
                  loading={isSubmitting}
                  startIcon={<Icon icon={saveFill} />}
                >
                  {t('common.btnUpdate')}
                </LoadingButton>
              </Grid>
            </Grid>
          </Stack>
        </Card>
      </Stack>
    </form>
  );
}
