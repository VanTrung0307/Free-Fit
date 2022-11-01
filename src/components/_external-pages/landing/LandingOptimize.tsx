// material
import { Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CarouselBasic2 } from 'components/carousel';

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
//       'Allow your brand to offer your customers a personalised buying experience. Go D2C and add a new distribution channel for your brand.',
//   },
//   {
//     icon: '/static/icons/ic_store.svg',
//     title: (
//       <>
//         Reso <br /> Hyperlocal Marketplace
//       </>
//     ),
//     description:
//       'Leverage your business with a hyperlocal marketplace platform and focus on your target audience, ensuring on-time delivery.',
//   },
//   {
//     icon: '/static/icons/ic_headless.svg',
//     title: (
//       <>
//         Reso <br /> Headless Commerce
//       </>
//     ),
//     description:
//       'Scale your business with an event-driven platform. Build your own front-end and enhance your business without worrying about the infrastructure.',
//   },
// ];

// const shadowIcon = (color: string) => `drop-shadow(2px 2px 2px ${alpha(color, 0.48)})`;

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    paddingBottom: theme.spacing(15),
  },
}));

// const SlickStyle = styled(Container)(({ theme }) => ({
//   '& .slick-initialized .slick-slide': {
//     padding: theme.spacing(0, 4),
//   },
// }));

// const PartnerImageStyle = styled(motion.img)(({ theme }) => ({
//   width: 'auto',
//   height: 56,
// }));
// // ----------------------------------------------------------------------

// const settings = {
//   dots: false,
//   infinite: true,
//   slidesToShow: 1,
//   slidesToScroll: 2,
//   arrows: false,
//   autoplay: true,
//   speed: 4000,
//   autoplaySpeed: 4000,
//   cssEase: 'linear',
//   className: 'slider variable-width',
//   variableWidth: true,
//   pauseOnHover: true,
// };

export default function LandingOptimize() {
  // const theme = useTheme();
  // const isLight = theme.palette.mode === 'light';
  // const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <RootStyle>
      <Container maxWidth="lg">
        <Grid container spacing={[2, 8]}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h2">Cách TZM tối ưu hệ thống của bạn</Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <CarouselBasic2 />
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
