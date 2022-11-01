// material
import {
  Box,
  Card,
  Container,
  Grid,
  LinkProps,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, styled, Theme, useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { MHidden } from 'components/@material-extend';
import Page from 'components/Page';
import ScrollToTop from 'components/ScrollToTop';
// components
import { LandingAdvertisement } from 'components/_external-pages/landing';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InView from 'react-intersection-observer';
import { NavHashLink } from 'react-router-hash-link';
import FeatureHero from '../feature/FeatureHero';

const RootStyle = styled(Page)({
  height: '100%',
});

const ContentStyle = styled('div')(({ theme }) => ({
  // overflow: 'hidden',
  // position: 'relative',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4, 0, 8),
}));

interface ListItemstyleprops extends LinkProps {
  component?: ReactNode;
  to?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  selected: {
    backgroundColor: alpha(theme.palette.primary.main, 0.5),
    color: theme.palette.primary.main,
  },
}));

const ListItemStyle = styled(ListItem)<ListItemstyleprops>(({ theme }) => ({
  ...theme.typography.h6,
  cursor: 'pointer',
  padding: 0,
  color: theme.palette.text.secondary,
  transition: theme.transitions.create('color'),
  '&:hover': {
    color: theme.palette.text.primary,
  },
  '& .MuiListItemButton-root .Mui-selected': {
    backgroundColor: alpha(theme.palette.primary.main, 0.5),
  },
}));

const StickyNavigation = styled(Card)({
  position: 'sticky',
  top: '80px',
  left: 0,
  right: 0,
});

type Feature = {
  icon: string;
  title: string;
  description: string;
};

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const { icon, title, description } = feature;

  return (
    <Card
      sx={{
        zIndex: 1,
        p: 5,
        boxShadow: (theme) =>
          `0px 48px 48px ${alpha(
            isLight ? theme.palette.grey[500] : theme.palette.common.black,
            0.12
          )}`,
        height: '100%',
      }}
    >
      <Stack spacing={5}>
        <Box
          component="img"
          src={icon}
          sx={{
            width: 64,
            height: 64,
          }}
        />
        <Typography variant="h4">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Stack>
    </Card>
  );
};

const scrollWithOffset = (el: HTMLElement) => {
  const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
  const yOffset = -80;
  window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
};

const FeaturesPage = () => {
  const [currentInviewIdx, setCurrentInviewIdx] = useState(0);
  const classes = useStyles();
  const { t } = useTranslation();
  const navigation = [
    {
      title: t('features.delivery'),
      to: 'delivery',
      items: [
        {
          title: t('ldPage.delivery'),
          description: t('ldPage.deliverySub'),
          icon: '/static/icons/delivery-truck.svg',
        },
        {
          title: t('features.optimizedRoutes'),
          description: t('features.optimizedRoutesDes'),
          icon: '/static/feature/route.svg',
        },
        {
          title: t('features.proofOfDelivery'),
          description: t('features.proofOfDeliveryDes'),
          icon: '/static/feature/packing-list.svg',
        },
        {
          title: t('features.easyNavigation'),
          description: t('features.easyNavigationDes'),
          icon: '/static/feature/monitoring.svg',
        },
        {
          title: t('features.agentCapacityManagement'),
          description: t('features.agentCapacityManagementDes'),
          icon: '/static/feature/agent-management.svg',
        },
        {
          title: t('features.taskNotification'),
          description: t('features.taskNotificationDes'),
          icon: '/static/feature/notification.svg',
        },
        {
          title: t('features.logistics'),
          description: t('features.logisticsDes'),
          icon: '/static/feature/delivery-man.svg',
        },
        {
          title: t('features.geofencing'),
          description: t('features.geofencingDes'),
          icon: '/static/feature/tracking-app.svg',
        },
      ],
    },
    {
      title: t('features.store'),
      to: 'store',
      items: [
        {
          title: t('features.storeChain'),
          description: t('features.storeChainDes'),
          icon: '/static/feature/chain.svg',
        },
        {
          title: t('features.scheduleTradeZone'),
          description: t('features.scheduleTradeZoneDes'),
          icon: '/static/feature/calendar.svg',
        },
        {
          title: t('features.assetManagement'),
          description: t('features.assetManagementDes'),
          icon: '/static/feature/resources.svg',
        },
        {
          title: t('ldPage.poi'),
          description: t('ldPage.poiSub'),
          icon: '/static/icons/pinpoi.svg',
        },
      ],
    },
    {
      title: t('features.dispatchDashboard'),
      to: 'analytics',
      items: [
        {
          title: t('features.apiAccess'),
          description: t('features.apiAccessDes'),
          icon: '/static/feature/api.svg',
        },
        {
          title: t('features.customfieldTemplates'),
          description: t('features.customfieldTemplatesDes'),
          icon: '/static/icons/website.svg',
        },
      ],
    },
    {
      title: t('features.benefit'),
      to: 'benefit',
      items: [
        {
          title: t('features.map'),
          description: t('features.mapDes'),
          icon: '/static/feature/map.svg',
        },
        {
          title: t('features.save'),
          description: t('features.saveDes'),
          icon: '/static/feature/money-bag.svg',
        },
      ],
    },
    {
      title: t('features.hostingSupport'),
      to: 'web-hosting',
      items: [
        {
          title: t('features.domain'),
          description: t('features.domainDes'),
          icon: '/static/feature/ic_domain.png',
        },
        {
          title: t('features.work'),
          description: t('features.workDes'),
          icon: '/static/feature/ic_worktime.png',
        },
        {
          title: t('features.ssl'),
          description: t('features.sslDes'),
          icon: '/static/feature/ic_ssl.png',
        },
        {
          title: t('features.updateNow'),
          description: t('features.updateNowDes'),
          icon: '/static/feature/ic_upgrade.png',
        },
        {
          title: t('features.support'),
          icon: '/static/feature/ic_support.png',
          description: t('features.supportDes'),
        },
      ],
    },
  ];
  return (
    <RootStyle title={t('features.title')} id="move_top">
      <FeatureHero />
      <ScrollToTop />

      <ContentStyle>
        <Container maxWidth="lg" sx={{ paddingY: 8 }}>
          <Stack direction="row" spacing={4}>
            <MHidden width="mdDown">
              <Box width="25%">
                <StickyNavigation>
                  <List component="nav" aria-label="secondary mailbox folder">
                    {navigation.map((nav, idx) => (
                      <NavHashLink
                        scroll={(el) => scrollWithOffset(el)}
                        key={nav.title}
                        style={{ textDecoration: 'none' }}
                        smooth
                        to={`/features#${nav.to}`}
                      >
                        <ListItemStyle>
                          <ListItemButton
                            classes={{ selected: classes.selected }}
                            selected={currentInviewIdx === idx}
                          >
                            {nav.title}
                          </ListItemButton>
                        </ListItemStyle>
                      </NavHashLink>
                    ))}
                  </List>
                </StickyNavigation>
              </Box>
            </MHidden>
            <Box flex={1}>
              <List sx={{ position: 'relative' }}>
                <Stack spacing={4}>
                  {navigation.map((nav, index) => (
                    <InView
                      threshold={0.5}
                      onChange={(inview) => {
                        if (inview) {
                          setCurrentInviewIdx(index);
                        }
                      }}
                      key={`features-${nav.title}`}
                    >
                      <Box id={nav.to}>
                        <Typography variant="h3" sx={{ mb: 4 }}>
                          {nav.title}
                        </Typography>

                        <Grid container spacing={6} sx={{ paddingLeft: [0, 0, 2] }}>
                          {nav.items?.map((feat, index) => (
                            <Grid
                              alignSelf="stretch"
                              key={`features-item-${nav.title}-${index}`}
                              item
                              xs={12}
                              md={6}
                            >
                              <FeatureCard feature={feat} />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </InView>
                  ))}
                </Stack>
              </List>
            </Box>
          </Stack>
        </Container>
        <LandingAdvertisement />
      </ContentStyle>
    </RootStyle>
  );
};

export default FeaturesPage;
