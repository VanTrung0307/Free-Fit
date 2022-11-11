import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
// material
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { useAppDispatch } from 'app/hooks';
import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
//

// ----------------------------------------------------------------------
type InitialValues = {
  username: string;
  password: string;
  afterSubmit?: string;
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required(t('login.errorUsername')),
    password: Yup.string().required(t('login.errorPassword')),
  });

  const formik = useFormik<InitialValues>({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      // dispatch(
      //   authAction.login({
      //     username: values.username,
      //     password: values.password,
      //   })
      // );

      if (values.username == fakeLogin.username && values.password == fakeLogin.password) {
        localStorage.setItem('access_token', 'random_code');
        // navigate('/dashboard');
        window.location.href = '/dashboard/analytics';
      }
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const fakeLogin = {
    username: 'admin',
    password: 'admin',
  };
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            autoComplete="username"
            type="text"
            label={t('login.username')}
            {...getFieldProps('username')}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label={t('login.password')}
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end" size="large">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <LoadingButton
          style={{ marginTop: '16px' }}
          fullWidth
          size="medium"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          {t('login.btnLogin')}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
