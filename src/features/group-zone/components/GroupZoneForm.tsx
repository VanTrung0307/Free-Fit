import { yupResolver } from '@hookform/resolvers/yup';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import { Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import InputField from 'components/FormField/InputField';
import { PostGroupZone } from 'models/dto/groupZone';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

interface GroupZoneFormProps {
  initialValue: PostGroupZone;
  isEdit: boolean;
  onSubmit?: (formValue: PostGroupZone) => void;
}

export default function GroupZoneForm({ initialValue, onSubmit, isEdit }: GroupZoneFormProps) {
  const { t } = useTranslation();
  // schema
  const schema = yup.object().shape({
    name: yup.string().required(t('groupZone.errorName')),
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
  const handelFormSubmit = (formValues: PostGroupZone) => {
    if (onSubmit) onSubmit(formValues);
  };
  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={8} md={8} lg={8}>
          <InputField name="name" label={`${t('groupZone.name')}*`} control={control} />
        </Grid>
        <Grid item xs={4} md={4} lg={4}>
          <LoadingButton
            disabled={!isDirty}
            type="submit"
            fullWidth
            variant="contained"
            size="medium"
            loading={isSubmitting}
            startIcon={<Icon icon={saveFill} />}
          >
            {isEdit ? t('common.btnUpdate') : t('common.btnSubmit')}
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
}
