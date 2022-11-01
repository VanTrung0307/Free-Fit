import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppSelector } from 'app/hooks';
import InputField from 'components/FormField/InputField';
import SelectField from 'components/FormField/SelectField';
import { PostBrand } from 'models';
import { useForm, useFormState, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useDebouncedCallback } from 'components/common';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import { PATH_DASHBOARD } from 'routes/paths';
import { useNavigate } from 'react-router';
import { styled } from '@mui/material/styles';
import Images from 'constants/image';
import ImageForm from 'components/ImageForm';
import { selectBrandTypeOptions } from '../brandSlice';

interface BrandFormProps {
  initialValue: PostBrand;
  onSubmit?: (formValue: PostBrand) => void;
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
export default function BrandForm({ initialValue, onSubmit, isEdit, isView }: BrandFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [imgLink, setImglink] = useState<string>(initialValue.imageUrl || Images.DEFAULT_IMG);
  const [iconLink, setIconlink] = useState<string>(initialValue.iconUrl || Images.PLACEHOLDER_IMG);
  // schema
  const schema = yup.object().shape({
    name: yup.string().required(t('brand.errorBrandName')),
    iconUrl: yup.string(),
    imageUrl: yup.string(),
    segmentId: yup
      .number()
      .typeError(t('common.isRequired'))
      .moreThan(0, t('brand.errorBrandType'))
      .required(t('brand.errorBrandType')),
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<any>({
    defaultValues: initialValue,
    resolver: yupResolver(schema),
  });
  const { isDirty } = useFormState({ control });
  const brandTypeOptions = useAppSelector(selectBrandTypeOptions);
  const handelFormSubmit = (formValues: PostBrand) => {
    if (onSubmit) onSubmit(formValues);
  };
  const handelInputFieldImgChange = useDebouncedCallback((e) => {
    setImglink(e.target.value);
  }, 500);

  const handelInputFieldIconChange = useDebouncedCallback((e) => {
    setIconlink(e.target.value);
  }, 500);

  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom marginBottom={2}>
                {t('brand.imageUrl')}
              </Typography>
              <Stack spacing={2}>
                <Box
                  style={{
                    display: 'flex',
                    flexFlow: 'row nowrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '10px',

                    height: '35.5vh',
                    width: '100%',
                  }}
                  mt={1}
                  mb={1}
                >
                  <Controller
                    control={control}
                    name="imageUrl"
                    render={({ field }) => (
                      <ImageForm {...field} value={field.value} title="Ảnh bìa" />
                    )}
                  />
                </Box>
                <Box
                  style={{
                    display: 'flex',
                    flexFlow: 'row nowrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '10px',

                    // height: '65.5vh',
                    width: '100%',
                    // position: 'relative',
                  }}
                  mt={1}
                  mb={3}
                >
                  <Controller
                    control={control}
                    name="iconUrl"
                    render={({ field }) => (
                      <ImageForm {...field} value={field.value} title="Icon" />
                    )}
                  />
                </Box>
              </Stack>
            </Card>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom marginBottom={2}>
              {t('brand.info')}
            </Typography>
            <Stack spacing={2}>
              <InputField
                name="name"
                label={`${t('brand.brandName')}*`}
                control={control}
                disabled={isView}
              />
              <InputField
                name="iconUrl"
                label={`${t('brand.icon')}*`}
                control={control}
                onChange={handelInputFieldIconChange}
                disabled={isView}
              />
              <InputField
                name="imageUrl"
                label={`${t('brand.img')}*`}
                control={control}
                onChange={handelInputFieldImgChange}
                disabled={isView}
              />
              <Box mt={2}>
                <SelectField
                  name="segmentId"
                  label={`${t('brand.segmentTypeName')}*`}
                  control={control}
                  options={brandTypeOptions}
                  disabled={isView}
                />
              </Box>
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
                  navigate(`${PATH_DASHBOARD.brand.root}`);
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
  );
}
