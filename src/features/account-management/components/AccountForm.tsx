import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppSelector } from 'app/hooks';
import InputField from 'components/FormField/InputField';
import SelectField from 'components/FormField/SelectField';
import { PostAccount } from 'models';
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
import { selectBrandTypeOptions } from '../accountSlice';

interface AccountFormProps {
  initialValue: PostAccount;
  onSubmit?: (formValue: PostAccount) => void;
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
export default function AccountForm({ initialValue, onSubmit, isEdit, isView }: AccountFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [imgLink, setImglink] = useState<string>(initialValue.imageUrl || Images.DEFAULT_IMG);
  // schema
  const schema = yup.object().shape({
    fullname: yup.string(),
    email: yup.string().required(t('account.errorEmail')),
    password: yup
      .string()
      .required(t('account.errorPassword'))
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự!'),
    phoneNumber: yup.string(),
    imageUrl: yup.string(),
    brandId: yup
      .number()
      .typeError(t('common.isRequired'))
      .moreThan(0, t('account.errorBrandType'))
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
  const handelFormSubmit = (formValues: PostAccount) => {
    if (onSubmit) onSubmit(formValues);
  };
  const handelInputFieldImgChange = useDebouncedCallback((e) => {
    setImglink(e.target.value);
  }, 500);

  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom marginBottom={2}>
                {t('account.imageUrl')}
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
                      <ImageForm {...field} value={field.value} title="Ảnh đại diện" />
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
              {t('account.info')}
            </Typography>
            <Stack spacing={2}>
              <InputField
                name="name"
                label={`${t('account.accountName')}*`}
                control={control}
                disabled={isView}
              />
              <InputField
                name="email"
                label={`${t('account.email')}*`}
                control={control}
                disabled={isView}
              />
              <InputField
                name="password"
                label={`${t('account.password')}*`}
                control={control}
                disabled={isView}
              />
              <InputField
                name="phoneNumber"
                label={`${t('account.phoneNumber')}*`}
                control={control}
                disabled={isView}
              />
              <InputField
                name="imageUrl"
                label={`${t('brand.img')}*`}
                control={control}
                onChange={handelInputFieldImgChange}
                disabled={isView}
              />
              {/* <Box mt={2}>
                <SelectField
                  name="brandId"
                  label={`${t('account.brandTypeName')}*`}
                  control={control}
                  options={brandTypeOptions}
                  disabled={isView}
                />
              </Box> */}
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
