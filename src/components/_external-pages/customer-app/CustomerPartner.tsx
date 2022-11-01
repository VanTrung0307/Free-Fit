import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
//
import { MotionInView, varFadeInDown, varWrapEnter } from '../../animate';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const RootStyle = styled(motion.div)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingBottom: theme.spacing(15),
  },
}));

const WrapperStyle = styled(Container)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    // position: 'absolute',
    // top: '-50%',
    // left: '50%',
    // transform: 'translate(-50%,0)'
    height: 350,
  },
}));

const SlickStyle = styled(Container)(({ theme }) => ({
  '& .slick-initialized .slick-slide': {
    padding: theme.spacing(0, 4),
  },
}));

export default function EnterprisePartner() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const settings = {
    dots: false,
    slidesToShow: isDesktop ? 2 : 1,
    slidesToScroll: 2,
    arrows: false,
    speed: 4000,
    className: 'slider variable-width',
    variableWidth: true,
    pauseOnHover: true,
  };

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <WrapperStyle maxWidth="lg">
          <MotionInView variants={varFadeInDown}>
            <Card>
              <CardContent
                sx={{
                  paddingY: 4,
                  paddingX: 4,
                }}
              >
                <Grid container spacing={8}>
                  <Grid item xs={12} sm={6} alignSelf="center">
                    <SlickStyle>
                      <Slider {...settings}>
                        <Box
                          height={140}
                          component="img"
                          src="/static/enterprise/domino-logo.png"
                        />
                        <Box height={140} component="img" src="/static/enterprise/passio.jpg" />
                      </Slider>
                    </SlickStyle>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={6}>
                      <Typography variant="h3">
                        Các doanh nghiệp đã tin tưởng sử dụng nền tảng của chúng tôi
                      </Typography>
                      <Box>
                        <Button endIcon={<ArrowRightAltIcon />}>Xem thêm</Button>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </MotionInView>
        </WrapperStyle>
      </RootStyle>
    </>
  );
}
