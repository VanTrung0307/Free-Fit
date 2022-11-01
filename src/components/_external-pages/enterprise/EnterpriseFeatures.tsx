import { alpha, Box, Container, Stack, Typography, useMediaQuery, Button } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { MotionInView, varFadeInLeft, varFadeInRight, varWrapEnter } from '../../animate';

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
      height: '40vh',
      width: 540,
      backgroundColor: theme.palette.background.paper,
    },
  };
});

export default function EnterpriseFeatures() {
  const theme = useTheme();

  const [id, setId] = useState(1);

  const list = [
    {
      id: '1',
      title: '1. Bảng điều khiển',
      txt: 'Tạo một hoặc nhiều tác vụ trong một lần thông qua bảng điều khiển.',
      img: '/static/enterprise/pos.jpg',
    },

    {
      id: '2',
      title: '2. Biểu mẫu',
      txt: 'Biểu mẫu cho phép bạn tạo các nhiệm vụ ngay lập tức trong bảng điều khiển bằng cách chấp nhận đơn đặt hàng từ khách hàng của bạn bằng cách sử dụng biểu mẫu đặt phòng trên web.',
      img: '/static/enterprise/form.jpg',
    },

    {
      id: '3',
      title: '3. Các ứng dụng của khách hàng',
      txt: 'Nhận đơn đặt hàng trực tiếp của khách hàng thông qua các ứng dụng có sẵn trên cả Android và iOS.',
      img: '/static/enterprise/app.jpg',
    },

    {
      id: '4',
      title: '4. Nền tảng quản lý đơn hàng / Marketplaces / POS / API',
      txt: 'Tạo đơn đặt hàng của bạn thông qua trang web của bên thứ 3 một cách suôn sẻ và hiệu quả.',
      img: '/static/enterprise/manage.jpg',
    },
  ];

  const list2 = [
    {
      id: '1',
      title: '1. Hiệu quả dựa trên thời gian và khoảng cách',
      txt: 'Nhận ngay báo cáo hiệu quả của các đại lý của bạn trên bảng điều khiển dựa trên Thời gian và Khoảng cách.',
      img: '/static/enterprise/custom.jpg',
    },

    {
      id: '2',
      title: '2. Phân tích thời gian thực',
      txt: 'Tăng hiệu quả của đại lý và sự hài lòng của khách hàng bằng cách sử dụng báo cáo thời gian thực của mọi tác vụ.',
      img: '/static/enterprise/time.jpg',
    },

    {
      id: '3',
      title: '3. Theo dõi và đánh giá người giao hàng',
      txt: 'Giám sát quá trình làm việc, vận chuyển dựa trên đánh giá thực tế của khách hàng và minh bạch hơn với khách hàng cuối.',
      img: '/static/enterprise/rate.jpg',
    },

    {
      id: '4',
      title: '4. Định giá và thu nhập',
      txt: 'Quản lý các khoản thanh toán cho tài xế một cách hiệu quả với Ví đại lý.',
      img: '/static/enterprise/finance.jpg',
    },
  ];

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <Container maxWidth="lg">
          <Stack spacing={[8, 12]}>
            <MotionInView variants={varFadeInLeft}>
              <Stack direction={{ xs: 'column-reverse', md: 'row' }} spacing={4}>
                <Stack spacing={6} sx={{ flex: 1 }}>
                  <Typography variant="h3">Tạo tác vụ</Typography>
                  {list.map((item) => (
                    <div
                      key={item.id}
                      onMouseOver={() => setId(Number(item.id))}
                      onFocus={() => setId(Number(item.id))}
                    >
                      <Typography variant="h6">
                        {item.title}
                        <Typography variant="body1">{item.txt}</Typography>
                      </Typography>
                    </div>
                  ))}

                  <Button
                    size="large"
                    variant="contained"
                    disableElevation
                    sx={{ width: '125px', height: ['48px', '100%'] }}
                  >
                    Bắt đầu
                  </Button>
                </Stack>
                <Box>
                  <HeroImgStyle
                    sx={{
                      position: 'relative',
                      top: 90,
                    }}
                    alt="feature-1"
                    src={list[id - 1].img}
                  />
                </Box>
              </Stack>
            </MotionInView>
            <MotionInView variants={varFadeInRight}>
              <Stack direction={{ xs: 'column-reverse', md: 'row-reverse' }} spacing={4}>
                <Stack spacing={6} sx={{ flex: 1 }}>
                  <Typography variant="h3">Phân tích & Báo cáo</Typography>

                  {list2.map((item) => (
                    <div
                      key={item.id}
                      onMouseOver={() => setId(Number(item.id))}
                      onFocus={() => setId(Number(item.id))}
                    >
                      <Typography variant="h6">
                        {item.title}
                        <Typography variant="body1">{item.txt}</Typography>
                      </Typography>
                    </div>
                  ))}

                  <Button
                    size="large"
                    variant="contained"
                    disableElevation
                    sx={{ width: '125px', height: ['48px', '100%'] }}
                  >
                    Bắt đầu
                  </Button>
                </Stack>

                <Box>
                  <HeroImgStyle
                    sx={{
                      position: 'relative',
                      top: 100,
                    }}
                    alt="feature-2"
                    src={list2[id - 1].img}
                  />
                </Box>
              </Stack>
            </MotionInView>
          </Stack>
        </Container>
      </RootStyle>
    </>
  );
}
