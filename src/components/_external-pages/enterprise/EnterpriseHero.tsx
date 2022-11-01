import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useScroll } from 'ahooks';
// material
import { MHidden } from 'components/@material-extend';
import { motion } from 'framer-motion';
//
import { varFadeInRight, varFadeInUp, varWrapEnter } from '../../animate';
import { ContentStyle, HeroImgStyle, RootStyle } from './Enterprise.styles';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function EnterpriseHero() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const { top } = useScroll();

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <Box
          component="img"
          src="/static/client/wave.svg"
          sx={{
            position: 'absolute',
            top: 240,
            left: 0,
            width: '100%',
            height: ['75vh', '40vh', `${top * 0 + 65}vh`],
            objectFit: 'cover',
            transition: 'all 300ms ease',
          }}
        />

        <MHidden width="mdDown">
          <HeroImgStyle
            style={{ top: -(top * 0.05) }}
            alt="hero"
            src="/static/enterprise/hero_img.jpg"
            variants={varFadeInUp}
          />
        </MHidden>

        <Container maxWidth="lg">
          <ContentStyle
            sx={{
              top: -(top * 0.05),
            }}
          >
            <motion.div variants={varFadeInRight}>
              <Typography variant="caption" sx={{ pb: 4 }}>
                Giải pháp thương mại điện tử doanh nghiệp
              </Typography>
              <Typography component="h1" variant={isDesktop ? 'h3' : 'h4'}>
                Đặt hàng theo yêu cầu cho Doanh nghiệp của bạn
              </Typography>
            </motion.div>

            <motion.div variants={varFadeInRight}>
              <Typography>
                Reso là giải pháp thương mại điện tử hiệu quả về chi phí đáng tin cậy nhất được xây
                dựng để giúp bạn phát triển
              </Typography>
            </motion.div>

            <Stack
              direction={['column', 'row']}
              spacing={[1.5, 1.5]}
              rowGap={[1.5, 1.5]}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
            >
              <motion.div variants={varFadeInRight}>
                <TextField
                  sx={{ pr: [0, 2], minWidth: 300 }}
                  fullWidth
                  variant="outlined"
                  size="medium"
                  placeholder="Email của bạn"
                />
              </motion.div>
              <motion.div variants={varFadeInRight}>
                <Button
                  size="large"
                  variant="contained"
                  disableElevation
                  sx={{ width: '100%', height: ['48px', '100%'] }}
                >
                  Liên hệ
                </Button>
              </motion.div>
            </Stack>
          </ContentStyle>
        </Container>
      </RootStyle>
    </>
  );
}
