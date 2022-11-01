import { Card, Divider, Grid, Link, Stack, Typography, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PATH_DASHBOARD } from 'routes/paths';
import { ICONS } from 'layouts/dashboard/SidebarConfig';

interface Props {}

type SettingCardProps = {
  icon: JSX.Element;
  title: string;
  path: string;
};

const SettingPage = (props: Props) => {
  const { t } = useTranslation();
  const user = JSON?.parse(localStorage.getItem('user') || '');
  const deliverySettings: SettingCardProps[] = [
    {
      title: t('common.team'),
      path: PATH_DASHBOARD.team.root,
      icon: ICONS.team,
    },
    {
      title: t('common.agent'),
      path: PATH_DASHBOARD.agent.root,
      icon: ICONS.agent,
    },
    {
      title: t('content.asset'),
      path: PATH_DASHBOARD.asset.root,
      icon: ICONS.asset,
    },
  ];

  const settingCards: SettingCardProps[] = [
    {
      icon: ICONS.store,
      title: t('content.stores'),
      path: PATH_DASHBOARD.store.root,
    },
    {
      title: 'Loại cửa hàng',
      path: PATH_DASHBOARD.storeType.root,
      icon: ICONS.groupZone,
    },
    {
      title: t('common.groupZone'),
      path: PATH_DASHBOARD.groupZone.root,
      icon: ICONS.groupZone,
    },
    {
      title: t('content.templates'),
      path: PATH_DASHBOARD.template.root,
      icon: ICONS.template,
    },
  ];

  const brandCards: SettingCardProps[] = [
    {
      icon: ICONS.brand,
      title: t('content.brands'),
      path: PATH_DASHBOARD.brand.root,
    },
    {
      icon: ICONS.segment,
      title: t('content.segments'),
      path: PATH_DASHBOARD.segment.root,
    },
  ];
  const settingCardsInterse: SettingCardProps[] = [
    { title: t('poi.sPoi'), path: PATH_DASHBOARD.poi.root, icon: ICONS.poi },
    { title: t('poi.poi'), path: PATH_DASHBOARD.poiBrand.root, icon: ICONS.poiBrand },
  ];

  return (
    <Container maxWidth="lg" sx={{ pt: 4 }}>
      <Card sx={{ p: 3, pb: 4 }}>
        <Typography variant="h4">{t('common.delivery')}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {deliverySettings.map((setting) => (
            <Grid key={setting.title} item xs={12} sm={4} md={3}>
              <Link
                to={setting.path}
                key={setting.title}
                color="primary"
                variant="h6"
                component={RouterLink}
                sx={{ display: 'block' }}
              >
                <Card
                  sx={{
                    p: 2,
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <Stack direction="column" alignItems="center" justifyContent="center">
                    <Box width={54} height={54} mb={4}>
                      {setting.icon}
                    </Box>
                    <Typography noWrap>{setting.title}</Typography>
                  </Stack>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Card>
      <Card sx={{ p: 3, pb: 4, mt: 4 }}>
        <Typography variant="h4">{t('setting.interse')}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {settingCards.map((setting) => (
            <Grid key={setting.title} item xs={12} sm={4} md={3}>
              <Link
                to={setting.path}
                key={setting.title}
                color="primary"
                variant="h6"
                component={RouterLink}
                sx={{ display: 'block' }}
              >
                <Card
                  sx={{
                    p: 2,
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <Stack direction="column" alignItems="center" justifyContent="center">
                    <Box width={54} height={54} mb={4}>
                      {setting.icon}
                    </Box>
                    <Typography noWrap>{setting.title}</Typography>
                  </Stack>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Card>
      {user?.role == 0 ? (
        <Card sx={{ p: 3, pb: 4, mt: 4 }}>
          <Typography variant="h4">{t('setting.brand')}</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {brandCards.map((setting) => (
              <Grid key={setting.title} item xs={12} sm={4} md={3}>
                <Link
                  to={setting.path}
                  key={setting.title}
                  color="primary"
                  variant="h6"
                  component={RouterLink}
                  sx={{ display: 'block' }}
                >
                  <Card
                    sx={{
                      p: 2,
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    <Stack direction="column" alignItems="center" justifyContent="center">
                      <Box width={54} height={54} mb={4}>
                        {setting.icon}
                      </Box>
                      <Typography noWrap>{setting.title}</Typography>
                    </Stack>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Card>
      ) : (
        ''
      )}
      <Card sx={{ p: 3, pb: 4, mt: 4 }}>
        <Typography variant="h4">{t('setting.common')}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {settingCardsInterse.map((setting) => (
            <Grid key={setting.title} item xs={12} sm={4} md={3}>
              <Link
                to={setting.path}
                key={setting.title}
                color="primary"
                variant="h6"
                component={RouterLink}
                sx={{ display: 'block' }}
              >
                <Card
                  sx={{
                    p: 2,
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <Stack direction="column" alignItems="center" justifyContent="center">
                    <Box width={54} height={54} mb={4}>
                      {setting.icon}
                    </Box>
                    <Typography noWrap>{setting.title}</Typography>
                  </Stack>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Container>
  );
};

export default SettingPage;
