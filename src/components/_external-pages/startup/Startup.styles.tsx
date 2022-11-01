import { Stack } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';

export const RootStyle = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('md')]: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
  },
}));

export const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  zIndex: 10,
  maxWidth: 540,
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

export const HeroImgStyle = styled(motion.img)(({ theme }) => {
  const shadowCard = (opacity: number) =>
    theme.palette.mode === 'light'
      ? alpha(theme.palette.grey[500], opacity)
      : alpha(theme.palette.common.black, opacity);

  return {
    top: 0,
    bottom: 0,
    zIndex: 8,
    margin: 'auto',
    position: 'absolute',
    borderRadius: '8px',
    opacity: 0.7,
    height: '35vh',
    right: '2%',
    width: 'auto',
    boxShadow: `0px 40px 80px 0 ${shadowCard(0.4)}`,
    [theme.breakpoints.up('lg')]: {
      height: '48vh',
      backgroundColor: theme.palette.background.paper,
    },
  };
});

export const HeroOverlayStyle = styled(motion.div)({
  zIndex: 9,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  opacity: 0.7,
});
