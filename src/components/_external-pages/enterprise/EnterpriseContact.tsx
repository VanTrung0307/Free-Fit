import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
//
import { MotionInView, varFadeInDown, varFadeInRight, varFadeInUp } from '../../animate';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 456,
  margin: 'auto',
  overflow: 'hidden',
  paddingBottom: theme.spacing(10),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  //   borderRadius: theme.shape.borderRadiusMd,
  backgroundImage: `linear-gradient(135deg,
      ${theme.palette.primary.main} 0%,
      ${theme.palette.primary.dark} 100%)`,
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    maxWidth: '100%',
    paddingBottom: 0,
    alignItems: 'center',
  },
}));

export default function EnterpriseContact() {
  const theme = useTheme();
  // const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Box width="100%">
      <ContentStyle>
        <MotionInView
          variants={varFadeInUp}
          sx={{
            mb: { xs: 3, md: 0 },
          }}
        >
          <motion.div animate={{ y: [-20, 0, -20] }} transition={{ duration: 4, repeat: Infinity }}>
            <Box
              component="img"
              alt="rocket"
              src="/static/home/rocket.png"
              sx={{ maxWidth: 460, width: 1 }}
            />
          </motion.div>
        </MotionInView>

        <Box
          sx={{
            pl: { md: 10 },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <MotionInView variants={varFadeInDown} sx={{ color: 'common.white', mb: 5, pr: 2 }}>
            <Typography variant="h3">
              Cần biết thêm thông tin! <br />
              Để lại email và chúng tôi sẽ liên lạc với bạn ngay
            </Typography>
          </MotionInView>
          <MotionInView variants={varFadeInDown}>
            <Stack
              direction={['column', 'row']}
              spacing={[1.5, 1.5]}
              rowGap={[1.5, 1.5]}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
            >
              <motion.div variants={varFadeInRight}>
                <TextField
                  sx={{
                    pr: [0, 2],
                    minWidth: 300,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                    input: {
                      '&::placeholder': {
                        color: theme.palette.text.primary,
                      },
                    },
                  }}
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
                  Gửi
                </Button>
              </motion.div>
            </Stack>
          </MotionInView>
        </Box>
      </ContentStyle>
    </Box>
  );
}
