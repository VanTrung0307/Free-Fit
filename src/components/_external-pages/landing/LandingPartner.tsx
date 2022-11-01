// material
import { Box, Container, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
//
import { MotionInView, varFadeInDown, varFadeInUp } from '../../animate';

// ----------------------------------------------------------------------

// const CARDS = [
//   {
//     icon: '/static/icons/ic_customer.svg',
//     title: (
//       <>
//         Reso <br /> Direct-to-Consumer
//       </>
//     ),
//     description:
//       'Allow your brand to offer your customers a personalised buying experience. Go D2C and add a new distribution channel for your brand.'
//   },
//   {
//     icon: '/static/icons/ic_store.svg',
//     title: (
//       <>
//         Reso <br /> Hyperlocal Marketplace
//       </>
//     ),
//     description:
//       'Leverage your business with a hyperlocal marketplace platform and focus on your target audience, ensuring on-time delivery.'
//   },
//   {
//     icon: '/static/icons/ic_headless.svg',
//     title: (
//       <>
//         Reso <br /> Headless Commerce
//       </>
//     ),
//     description:
//       'Scale your business with an event-driven platform. Build your own front-end and enhance your business without worrying about the infrastructure.'
//   }
// ];

// const shadowIcon = (color: string) => `drop-shadow(2px 2px 2px ${alpha(color, 0.48)})`;

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    paddingBottom: theme.spacing(15),
  },
}));

const SlickStyle = styled(Container)(({ theme }) => ({
  '& .slick-initialized .slick-slide': {
    padding: theme.spacing(0, 4),
  },
}));

const PartnerImageStyle = styled(motion.img)(({ theme }) => ({
  width: 'auto',
  height: 56,
}));
// ----------------------------------------------------------------------

const settings = {
  dots: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 2,
  arrows: false,
  autoplay: true,
  speed: 4000,
  autoplaySpeed: 4000,
  cssEase: 'linear',
  className: 'slider variable-width',
  variableWidth: true,
  pauseOnHover: true,
};

export default function LandingPartner() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  // const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <RootStyle>
      <Container maxWidth="lg">
        <Container maxWidth="lg">
          <Box sx={{ mb: { xs: 10, md: 15 }, textAlign: 'center' }}>
            <MotionInView variants={varFadeInDown}>
              <Typography variant="h2" sx={{ mb: 2 }}>
                Được sử dụng bởi các chuỗi thương hiệu lớn
              </Typography>
            </MotionInView>
            <MotionInView variants={varFadeInUp}>
              <Typography
                variant="h4"
                sx={{
                  color: isLight ? 'text.secondary' : 'text.primary',
                }}
              >
                Cũng như các mô hình Khởi nghiệp bán lẻ kiểu mới
              </Typography>
            </MotionInView>
          </Box>
        </Container>

        <SlickStyle maxWidth="md">
          <Slider {...settings}>
            <PartnerImageStyle src="/static/home/domino-horizontal.png" />
            <PartnerImageStyle src="/static/home/passio.jpg" />
          </Slider>
        </SlickStyle>
      </Container>
    </RootStyle>
  );
}
