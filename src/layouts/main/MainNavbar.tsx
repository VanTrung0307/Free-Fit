import { AppBar, Box, Button, Container, Toolbar } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import { useAppDispatch } from 'app/hooks';
import { useTranslation } from 'react-i18next';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { MHidden } from '../../components/@material-extend';
// components
import Logo from '../../components/Logo';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
import navConfig, { rightMenuConfig } from './MenuConfig';
//
import MenuDesktop from './MenuDesktop';
import MenuMobile from './MenuMobile';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 56;
const APP_BAR_DESKTOP = 56;

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: APP_BAR_MOBILE,
  transition: theme.transitions.create(['height', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('md')]: {
    height: APP_BAR_DESKTOP,
  },
}));

const ToolbarShadowStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: 'auto',
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8,
}));

// ----------------------------------------------------------------------

export type MenuItemProps = {
  title: string;
  path: string;
  icon?: JSX.Element;
  children?: {
    subheader: string;
    items: {
      title: string;
      path: string;
    }[];
  }[];
};

export type MenuProps = {
  isOffset: boolean;
  isHome: boolean;
  navConfig: MenuItemProps[];
};

export default function MainNavbar() {
  const isOffset = useOffSetTop(100);
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const { t } = useTranslation();
  // const user = getCurrentUser();
  const dispatch = useAppDispatch();
  // const handelLogout = () => {
  //   dispatch(authAction.logout());
  // };
  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            bgcolor: 'background.default',
            height: { md: APP_BAR_DESKTOP - 16 },
          }),
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box mr={4}>
            <RouterLink to="/">
              <Logo />
            </RouterLink>
          </Box>

          <MHidden width="mdDown">
            <MenuDesktop isOffset={isOffset} isHome={isHome} navConfig={navConfig} />
          </MHidden>

          <Box sx={{ flexGrow: 1 }} />

          <MHidden width="mdDown">
            <MenuDesktop isOffset={isOffset} isHome={isHome} navConfig={rightMenuConfig} />
          </MHidden>
          <MHidden width="mdDown">
            <Button variant="contained" component={RouterLink} to={PATH_DASHBOARD.root}>
              {t('content.login')}
            </Button>
          </MHidden>

          <MHidden width="mdUp">
            <MenuMobile
              isOffset={isOffset}
              isHome={isHome}
              navConfig={[...navConfig, ...rightMenuConfig]}
            />
          </MHidden>
        </Container>
      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  );
}
