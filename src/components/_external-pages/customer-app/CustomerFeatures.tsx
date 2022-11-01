import { alpha, Container, Stack, Typography, useMediaQuery, Box, Card } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { MotionInView, varFadeInLeft, varFadeInUp, varWrapEnter } from '../../animate';

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
    boxShadow: `0px 100px 80px 0 ${shadowCard(0.4)}`,
    height: '',
    width: 300,
  };
});

const CardShadowLeft = styled(Card)(({ theme }) => {
  const shadowCard = (opacity: number) =>
    theme.palette.mode === 'light'
      ? alpha(theme.palette.grey[500], opacity)
      : alpha(theme.palette.common.black, opacity);

  return {
    margin: 'auto',
    padding: theme.spacing(4, 2, 4),
    boxShadow: `-20px 20px 20px 10px ${shadowCard(0.2)}`,
  };
});

const CardShadowRight = styled(Card)(({ theme }) => {
  const shadowCard = (opacity: number) =>
    theme.palette.mode === 'light'
      ? alpha(theme.palette.grey[500], opacity)
      : alpha(theme.palette.common.black, opacity);

  return {
    margin: 'auto',
    padding: theme.spacing(4, 2, 4),
    boxShadow: `20px 20px 20px 10px ${shadowCard(0.2)}`,
  };
});

export default function EnterpriseFeatures() {
  const theme = useTheme();
  // const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [id, setId] = useState(1);

  const list = [
    {
      id: '1',
      title: 'Hoàn toàn có thể tùy chỉnh',
      txt: 'Thiết kế quy trình theo Trường hợp sử dụng kinh doanh của bạn.',
      img: '/static/customer-app/1.webp',
    },

    {
      id: '2',
      title: 'Định giá dựa trên hàng rào địa lý',
      txt: 'Sử dụng định giá dựa trên thẻ và khu vực cho nhu cầu bản địa hóa.',
      img: '/static/customer-app/2.webp',
    },

    {
      id: '3',
      title: 'Sự liên lạc khẩn cấp',
      txt: 'Khách hàng có thể gọi điện hoặc trò chuyện với đại lý bằng ứng dụng chỉ với một cú nhấp chuột',
      img: '/static/customer-app/3.webp',
    },

    {
      id: '4',
      title: 'Hiệu suất và Xếp hạng',
      txt: 'Nhận phản hồi và xếp hạng dễ dàng từ khách hàng để lập kế hoạch hành động trong tương lai.',
      img: '/static/customer-app/4.webp',
    },

    {
      id: '5',
      title: 'Thông báo và Cảnh báo',
      txt: 'Cập nhật trạng thái đơn hàng trực tiếp cho khách hàng để nâng cao trải nghiệm.',
      img: '/static/customer-app/5.webp',
    },

    {
      id: '6',
      title: 'Theo dõi thời gian thực',
      txt: 'Theo dõi vị trí chính xác trên bản đồ và giao hàng ETA.',
      img: '/static/customer-app/6.webp',
    },

    {
      id: '7',
      title: 'Ví khách hàng tích hợp sẵn',
      txt: 'Cung cấp cho khách hàng sự linh hoạt khi nạp tiền một lần.',
      img: '/static/customer-app/7.webp',
    },

    {
      id: '8',
      title: 'Khuyến mãi và ưu đãi',
      txt: 'Đẩy giảm giá và khuyến mại cho khách hàng bằng cách sử dụng mã phiếu giảm giá và thông báo.',
      img: '/static/customer-app/8.webp',
    },
  ];

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <Container maxWidth="lg">
          <Stack spacing={[8, 12]}>
            <MotionInView
              variants={varFadeInUp}
              sx={{ mb: { xs: 10, md: 15 }, textAlign: 'center' }}
            >
              <Typography variant="h3">
                Ứng dụng khách hàng TZM sẽ giúp ích gì cho doanh nghiệp của bạn?
              </Typography>
            </MotionInView>
            <MotionInView variants={varFadeInLeft}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={12}>
                <Stack spacing={6} sx={{ flex: 1 }}>
                  {list.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      onMouseOver={() => setId(Number(item.id))}
                      onFocus={() => setId(Number(item.id))}
                    >
                      <CardShadowLeft>
                        <Typography variant="h6">
                          {item.title}
                          <Typography variant="body1">{item.txt}</Typography>
                        </Typography>
                      </CardShadowLeft>
                    </div>
                  ))}
                </Stack>
                <Box>
                  <HeroImgStyle
                    sx={{
                      position: 'relative',
                      top: 70,
                    }}
                    alt="feature"
                    src={list[id - 1].img}
                  />
                </Box>
                <Stack spacing={6} sx={{ flex: 1 }}>
                  {list.slice(4).map((item) => (
                    <div
                      key={item.id}
                      onMouseOver={() => setId(Number(item.id))}
                      onFocus={() => setId(Number(item.id))}
                    >
                      <CardShadowRight>
                        <Typography variant="h6">
                          {item.title}
                          <Typography variant="body1">{item.txt}</Typography>
                        </Typography>
                      </CardShadowRight>
                    </div>
                  ))}
                </Stack>
              </Stack>
            </MotionInView>
          </Stack>
        </Container>
      </RootStyle>
    </>
  );
}
