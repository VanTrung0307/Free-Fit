import { Box, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { MotionInView, varFadeInDown, varFadeInUp, varWrapEnter } from '../../animate';

const RootStyle = styled(motion.div)(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
  backgroundColor: theme.palette.background.default,
}));

const WrapperStyle = styled(Container)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {},
}));

const ITEMS = [
  {
    icon: '1.svg',
    title: 'Nhận đặt hàng tức thì mọi lúc mọi nơi',
  },
  {
    icon: '2.svg',
    title: 'Giảm ảnh hưởng của tình huống bất trắc',
  },
  {
    icon: '3.svg',
    title: 'Dự báo nhu cầu qua việc sử dụng lịch sử đơn đặt hàng',
  },
  {
    icon: '4.svg',
    title: 'Giao tiếp 1-1 tốt hơn với khách hàng của bạn',
  },
  {
    icon: '5.svg',
    title: 'Tăng sự hài lòng của khách hàng',
  },
  {
    icon: '6.svg',
    title: 'Giúp bạn đạt được lợi thế cạnh tranh trên thị trường',
  },
];

export default function StatupOverview() {
  // const theme = useTheme();

  return (
    <>
      <RootStyle variants={varWrapEnter}>
        <WrapperStyle maxWidth="lg">
          <MotionInView variants={varFadeInUp} sx={{ mb: { xs: 10, md: 15 }, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ mb: 12 }}>
              Tại sao doanh nghiệp của bạn cần Ứng dụng khách hàng?
            </Typography>
          </MotionInView>
          <MotionInView variants={varFadeInDown}>
            <Card>
              <CardContent
                sx={{
                  paddingX: 4,
                  paddingY: 4,
                }}
              >
                <Grid container spacing={[2, 8]}>
                  {ITEMS.map((item, index) => (
                    <Grid
                      key={`${item.title}-${index}`}
                      item
                      xs={6}
                      sm={4}
                      alignSelf="stretch"
                      textAlign="center"
                    >
                      <Box
                        component="img"
                        src={`/static/customer-app/${item.icon}`}
                        width={80}
                        height={80}
                        mx="auto"
                        mb={2}
                      />
                      <Typography variant="h6">{item.title}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </MotionInView>
        </WrapperStyle>
      </RootStyle>
    </>
  );
}
