// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Grid, Card, Container, Typography, useMediaQuery } from '@mui/material';
//
import { useTranslation } from 'react-i18next';
import { varFadeInUp, MotionInView, varFadeInDown } from '../../animate';

// ----------------------------------------------------------------------

const shadowIcon = (color: string) => `drop-shadow(2px 2px 2px ${alpha(color, 0.48)})`;

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(14),
  [theme.breakpoints.up('md')]: {
    paddingBottom: theme.spacing(14),
  },
}));

const CardStyle = styled(Card)(({ theme }) => {
  const shadowCard = (opacity: number) =>
    theme.palette.mode === 'light'
      ? alpha(theme.palette.grey[500], opacity)
      : alpha(theme.palette.common.black, opacity);

  return {
    maxWidth: 380,
    minHeight: 400,
    height: '100%',
    margin: 'auto',
    textAlign: 'center',
    padding: theme.spacing(4, 2, 4),
    boxShadow: `-40px 40px 80px 0 ${shadowCard(0.48)}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      boxShadow: 'none',
      // backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
    },
    '&.cardLeft': {},
    '&.cardCenter': {
      [theme.breakpoints.up('md')]: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0px 40px 80px 0 ${shadowCard(0.4)}`,
      },
    },
  };
});

const CardIconStyle = styled('img')(({ theme }) => ({
  width: 54,
  height: 54,
  margin: '0 auto',
  marginBottom: theme.spacing(10),
  filter: shadowIcon(theme.palette.primary.main),
}));

// ----------------------------------------------------------------------

export default function LandingMinimalHelps() {
  const { t } = useTranslation();
  const CARDS = [
    {
      icon: '/static/icons/ic_franchise.svg',
      title: t('ldPage.manageStore'),
      description: t('ldPage.storeSub'),
    },
    {
      icon: '/static/icons/map-location.svg',
      title: t('ldPage.manageArea'),
      description: t('ldPage.areaSub'),
    },
    {
      icon: '/static/icons/pinpoi.svg',
      title: t('ldPage.poi'),
      description: t('ldPage.poiSub'),
    },
    {
      icon: '/static/icons/delivery-truck.svg',
      title: t('ldPage.manageAgent'),
      description: t('ldPage.agentSub'),
    },
    {
      icon: '/static/icons/website.svg',
      title: t('ldPage.template'),
      description: t('ldPage.templateSub'),
    },
    {
      icon: '/static/icons/product-management.svg',
      title: t('ldPage.delivery'),
      description: t('ldPage.deliverySub'),
    },
  ];
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <RootStyle>
      <Container maxWidth="lg">
        <Container maxWidth="md">
          <Box sx={{ mb: { xs: 10, md: 15 }, textAlign: 'center' }}>
            <MotionInView variants={varFadeInDown}>
              <Typography variant="h2" sx={{ mb: 2 }}>
                {t('ldPage.solution')}
              </Typography>
            </MotionInView>
            {/* <MotionInView variants={varFadeInUp}>
              <Typography
                sx={{
                  color: isLight ? 'text.secondary' : 'text.primary'
                }}
              >
                {t('ldPage.subSlogan')}
              </Typography>
            </MotionInView> */}
          </Box>
        </Container>

        <Grid container spacing={isDesktop ? 5 : 5} alignItems="stretch">
          {CARDS.map((card, index) => (
            <Grid key={`card-hero-${index}`} item xs={12} md={4}>
              <MotionInView sx={{ height: '100%' }} variants={varFadeInUp}>
                <CardStyle variant="outlined">
                  <Box textAlign="center">
                    <CardIconStyle
                      src={card.icon}
                      sx={{
                        ...(index % 3 === 0 && {
                          filter: (theme) => shadowIcon(theme.palette.warning.main),
                        }),
                        ...(index % 3 === 1 && {
                          filter: (theme) => shadowIcon(theme.palette.error.main),
                        }),
                        ...(index % 3 === 2 && {
                          filter: (theme) => shadowIcon(theme.palette.info.main),
                        }),
                      }}
                    />
                    <Typography variant="h4" paragraph>
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ color: isLight ? 'text.secondary' : 'common.white' }}
                    >
                      {card.description}
                    </Typography>
                  </Box>
                </CardStyle>
              </MotionInView>
            </Grid>
          ))}
        </Grid>
      </Container>
    </RootStyle>
  );
}
