import { Box, Card, Container, Link, Stack, Typography } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
// routes
import { PATH_AUTH } from 'routes/paths';
import { MHidden } from '../../components/@material-extend';
// hooks
// layouts
// components
import Page from '../../components/Page';
import AuthLayout from './components/AuthLayout';
import LoginForm from './components/LoginForm';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { t } = useTranslation();
  return (
    <RootStyle title={t('login.btnLogin')}>
      <AuthLayout>
        {t('content.backHomePage')} &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to={PATH_AUTH.homePage}>
          {t('content.home')}
        </Link>
      </AuthLayout>
      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10 }}>
            {t('login.welcome')}
          </Typography>
          <img src="/static/home/login.svg" alt="login" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                {t('login.title')}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{t('login.options')}</Typography>
            </Box>
          </Stack>
          <LoginForm />
          <MHidden width="smUp">
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              {t('content.backHomePage')} &nbsp;
              <Link
                underline="none"
                variant="subtitle2"
                component={RouterLink}
                to={PATH_AUTH.homePage}
              >
                {t('content.home')}
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
