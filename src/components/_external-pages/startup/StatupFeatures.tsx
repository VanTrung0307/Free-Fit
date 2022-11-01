import { alpha, Container, Stack, Typography, useMediaQuery, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
//
import { MotionInView, varFadeInLeft, varFadeInRight, varWrapEnter } from '../../animate';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const RootStyle = styled(motion.div)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
}));

const HeroImgStyle = styled(motion.img)(({ theme }) => {
  const shadowCard = (opacity: number) =>
    theme.palette.mode === 'light'
      ? alpha(theme.palette.grey[500], opacity)
      : alpha(theme.palette.common.black, opacity);

  return {
    borderRadius: '8px',
    height: '35vh',
    marginTop: 0,
    objectFit: 'cover',
    width: 'auto',
    boxShadow: `0px 40px 80px 0 ${shadowCard(0.4)}`,
    [theme.breakpoints.up('lg')]: {
      height: '45vh',
      width: 540,
      backgroundColor: theme.palette.background.paper,
    },
  };
});

const FEATURES = [
  {
    title: 'Cá nhân hóa trang web của bạn theo ý muốn',
    caption: '',
    image: '/static/startup/customize_feature.jpg',
    featureDetails: [
      {
        title: 'Thêm thương hiệu của bạn',
        descripiton:
          'Logo, Hình nền, Hình ảnh của bạn sẽ hiển thị trên từng sản phẩm, khách hàng sẽ nhận ra bạn ngay.',
      },
      {
        title: 'Cá nhân hóa theo nhu cầu của bạn',
        descripiton:
          'Trang web sẽ như những gì bạn muốn. Không ai cần biết ai đang ở trong hậu trường.',
      },
      {
        title: 'Thể hiện phong cách của bạn',
        descripiton:
          'Nguyên tắc thiết kế thương hiệu là chìa khóa thành công cho thương hiệu của bạn, vì điều này, bạn có thể thay đổi tất cả màu sắc của sản phẩm, phông chữ và thậm chí tùy chỉnh chúng theo ý mình.',
      },
    ],
  },
  {
    title: 'Kiểm soát đơn hàng dễ dàng',
    caption: 'Orders Dashboard',
    image: '/static/startup/order_feature.jpg',
    featureDetails: [
      {
        title: 'Tình trạng đặt hàng',
        descripiton:
          'Luôn cập nhật cho mọi người, thay đổi trạng thái trên tất cả các đơn hàng chỉ trong vài cú nhấp chuột, khách hàng sẽ nhận được thông báo về mọi thay đổi.',
      },
      {
        title: 'Chi tiết đơn hàng',
        descripiton:
          'Xem thông tin đơn hàng cần thiết trên màn hình lớn dễ hiểu hoặc xem chi tiết đầy đủ bên trong mỗi đơn hàng.',
      },
    ],
  },
  {
    title: 'Xây dựng chương trình giảm giá',
    caption: 'Offers & Discounts',
    image: '/static/startup/discount_feature.jpg',
    featureDetails: [
      {
        title: 'Giảm giá tự động',
        descripiton:
          'Giảm theo "giá" hoặc "phần trăm" nhất định cho mọi đơn đặt hàng khi họ đạt đến số tiền tối thiểu khi mua hàng',
      },
      {
        title: 'Phiếu giảm giá',
        descripiton:
          'Cho phép khách hàng của bạn đăng ký các ưu đãi sản phẩm nhất định bằng cách sử dụng mã phiếu giảm giá khi thanh toán',
      },
    ],
  },
  {
    title: 'Tăng doanh số bán hàng của bạn',
    caption: '',
    image: '/static/startup/sale_feature.jpg',
    featureDetails: [
      {
        title: 'Đặt hàng trước',
        descripiton:
          'Cho phép khách hàng của bạn đặt hàng từ nhiều ngày trước và lên kế hoạch cho tuần của họ.',
      },
      {
        title: 'Upselling',
        descripiton:
          'Ngay trước khi thanh toán, hãy cho phép khách hàng thêm thứ khác mà họ có thể bỏ lỡ vào giỏ hàng của mình chỉ bằng một cú nhấp chuột và nhận được nhiều doanh số hơn.',
      },
    ],
  },
];

export default function StatupFeatures() {
  const theme = useTheme();
  // const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        {FEATURES.map((feature, index) => {
          const secondary = index % 2 !== 0;
          return (
            <MotionInView
              sx={{
                backgroundColor: secondary
                  ? theme.palette.background.neutral
                  : theme.palette.background.default,
              }}
              key={`features-${index}`}
              variants={secondary ? varFadeInRight : varFadeInLeft}
            >
              <Container maxWidth="lg">
                <Stack
                  py={14}
                  direction={{ xs: 'column-reverse', md: secondary ? 'row' : 'row-reverse' }}
                  spacing={10}
                  alignItems="center"
                >
                  <Stack spacing={6} sx={{ flex: 1 }} textAlign={['center', 'left']}>
                    <Box>
                      <Typography mb={1} variant="subtitle1">
                        {feature.caption}
                      </Typography>
                      <Typography variant="h3">{feature.title}</Typography>
                    </Box>
                    <Stack spacing={4}>
                      {feature.featureDetails.map((fetureDetail) => (
                        <Box key={`featureDetail-${fetureDetail.title}`}>
                          <Stack spacing={1}>
                            <Typography variant="h5">{fetureDetail.title}</Typography>
                            <Typography>{fetureDetail.descripiton}</Typography>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                  <Box>
                    <HeroImgStyle alt="feature-1" src={feature.image} />
                  </Box>
                </Stack>
              </Container>
            </MotionInView>
          );
        })}
      </RootStyle>
    </>
  );
}
