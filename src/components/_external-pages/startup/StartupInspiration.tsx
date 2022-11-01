import { Box, Container, Grid, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
//
import { varFadeInUp, MotionInView, varFadeInDown, varWrapEnter } from '../../animate';

const RootStyle = styled(motion.div)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  backgroundColor: theme.palette.background.default,
}));

const StartupInspiration = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
      <Container maxWidth="lg">
        <Container maxWidth="md">
          <Box sx={{ mb: { xs: 10, md: 15 }, textAlign: 'center' }}>
            <MotionInView variants={varFadeInDown}>
              <Typography variant="h3" sx={{ mb: 3 }}>
                Cần một ví dụ thực tế?
              </Typography>
            </MotionInView>
            <MotionInView variants={varFadeInUp}>
              <Typography
                sx={{
                  color: isLight ? 'text.secondary' : 'text.primary',
                }}
              >
                Hãy để chúng tôi cho bạn thấy một vài ví dụ về những gì bạn có thể trở thành một
                cách nhanh chóng.
              </Typography>
            </MotionInView>
          </Box>
        </Container>
        <Grid container spacing={8} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Box component="img" src="/static/startup/inspire1.png" minWidth={300} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box component="img" src="/static/startup/inspire2.png" minWidth={300} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box component="img" src="/static/startup/inspire3.png" minWidth={300} />
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
};

export default StartupInspiration;
