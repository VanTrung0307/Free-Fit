import { alpha, Container, Stack, Typography, useMediaQuery, Box, Button } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
//
import { MotionInView, varFadeInLeft, varWrapEnter } from '../../animate';

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
      height: '40vh',
      width: 540,
      backgroundColor: theme.palette.background.paper,
    },
  };
});

export default function EnterpriseScale() {
  const theme = useTheme();
  // const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [id, setId] = useState(1);

  const list = [
    {
      id: '1',
      title: '1. Thông báo trong ứng dụng',
      txt: 'Đơn hàng do khách hàng đặt sẽ được kiểm tra đối chiếu với hàng trong kho của tất cả tài xế và sau đó thông báo được gửi đến tài xế có đủ hàng.',
      img: '/static/enterprise/noti.jpg',
    },

    {
      id: '2',
      title: '2. Theo dõi nhiệm vụ',
      txt: 'Khách hàng nhận được liên kết theo dõi SMS & theo dõi ứng dụng Để theo dõi tài xế và thời gian đến dự kiến.',
      img: '/static/enterprise/control.jpg',
    },

    {
      id: '3',
      title: '3. Giao tiếp trong ứng dụng',
      txt: 'Cho phép khách hàng trò chuyện trực tiếp với đại lý được chỉ định của họ từ ứng dụng và tránh sự chậm trễ không mong muốn.',
      img: '/static/enterprise/commu.jpg',
    },

    {
      id: '4',
      title: '4. Bằng chứng giao hàng',
      txt: 'Cho phép các đại lý của bạn quét mã vạch, thêm ghi chú, hình ảnh và thu thập chữ ký điện tử.',
      img: '/static/enterprise/proof.jpg',
    },
  ];

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <Container maxWidth="lg">
          <MotionInView variants={varFadeInLeft}>
            <Stack direction={{ xs: 'column-reverse', md: 'row' }} spacing={4}>
              <Stack spacing={6} sx={{ flex: 1 }}>
                <Typography variant="h3">Thực thi / Hoàn thành Nhiệm vụ</Typography>
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
                    top: 110,
                  }}
                  alt="feature-3"
                  src={list[id - 1].img}
                />
              </Box>
            </Stack>
          </MotionInView>
        </Container>
      </RootStyle>
    </>
  );
}
