import flashFill from '@iconify/icons-eva/flash-fill';
import { Icon } from '@iconify/react';
import { Button, Container, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import { MHidden } from 'components/@material-extend';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import { varFadeInRight, varFadeInUp, varWrapEnter } from '../../animate';

// ----------------------------------------------------------------------

const RootStyle = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('md')]: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
  },
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  zIndex: 10,
  maxWidth: 600,
  margin: 'auto',
  textAlign: 'center',
  position: 'relative',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    margin: 'unset',
    textAlign: 'left',
  },
}));

const HeroImgStyle = styled(motion.img)(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  width: '100%',
  margin: 'auto',
  position: 'absolute',
  [theme.breakpoints.up('md')]: {
    right: '5%',
    width: 'auto',
    height: '48vh',
  },
}));

// ----------------------------------------------------------------------

export default function FeatureHero() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        {/* <HeroOverlayStyle alt="overlay" src="/static/overlay.svg" variants={varFadeIn} /> */}

        <MHidden width="mdDown">
          <HeroImgStyle
            alt="hero"
            style={{ width: '50%' }}
            src="/static/feature/features.svg"
            variants={varFadeInUp}
          />
        </MHidden>

        <Container maxWidth="lg">
          <ContentStyle>
            <motion.div variants={varFadeInRight}>
              <Typography
                variant={isDesktop ? 'h2' : 'h3'}
                component="h1"
                color="text.default"
                sx={{ fontWeight: 'normal' }}
              >
                <Typography component="span" variant={isDesktop ? 'h2' : 'h3'}>
                  Tất cả tính năng{' '}
                </Typography>
                bạn cần để phát triển kinh doanh
              </Typography>
            </motion.div>

            <Stack
              direction="row"
              spacing={1.5}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
            >
              <motion.div variants={varFadeInRight}>
                <Button
                  size="large"
                  variant="contained"
                  component={RouterLink}
                  to={PATH_DASHBOARD.root}
                  startIcon={<Icon icon={flashFill} width={20} height={20} />}
                >
                  Bắt đầu ngay
                </Button>
              </motion.div>
            </Stack>
          </ContentStyle>
        </Container>
      </RootStyle>
    </>
  );
}
