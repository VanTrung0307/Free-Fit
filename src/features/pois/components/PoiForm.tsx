import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppSelector } from 'app/hooks';
import InputField from 'components/FormField/InputField';
import SelectField from 'components/FormField/SelectField';
import { PostPoi } from 'models';
import * as React from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { selectPoiTypeOptions } from '../poiSlice';

interface PoiFormProps {
  initialValue: PostPoi;
  onSubmit?: (formValue: PostPoi) => void;
  isEdit: boolean;
}

export default function PoiForm({ initialValue, onSubmit, isEdit }: PoiFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const poiTypeOptions = useAppSelector(selectPoiTypeOptions);
  // schema
  const schema = yup.object().shape({
    name: yup.string().required(t('poi.errorPoiName')),
    poiCode: yup.string().required(t('poi.errorBrandPoiCode')),
    poiTypeId: yup.number().moreThan(0, t('poi.errorPoiType')).required(t('poi.errorPoiType')),
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
  const handelFormSubmit = (formValues: PostPoi) => {
    if (onSubmit) onSubmit(formValues);
  };
  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Stack spacing={2}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom marginBottom={4}>
            {t('poi.infoPoi')}
          </Typography>
          <Stack spacing={2}>
            <InputField
              name="name"
              label={`${t('poi.poiName')}*`}
              control={control}
              disabled={isEdit}
            />
            <InputField
              name="poiCode"
              label={`${t('poi.poiCode')}*`}
              control={control}
              disabled={isEdit}
            />
            <Box mt={2}>
              <SelectField
                name="poiTypeId"
                label={`${t('poi.poiType')}*`}
                control={control}
                options={poiTypeOptions}
                disabled={isEdit}
              />
            </Box>
          </Stack>
        </Card>
        {isEdit ? (
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
                navigate(`${PATH_DASHBOARD.poi.root}`);
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
          // <LoadingButton
          //   disabled={!isDirty}
          //   type="submit"
          //   fullWidth
          //   variant="contained"
          //   size="large"
          //   loading={isSubmitting}
          // >
          //   {t('common.btnSubmit')}
          // </LoadingButton>
        )}
      </Stack>
    </form>
  );
}
