import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import Iconify from 'components/Iconify';
import React, { ReactNode } from 'react';
import { fCurrency, fShortenNumber } from 'utils/formatNumber';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import AccessibleIcon from '@mui/icons-material/Accessible';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';

type Props = {
  icon: string;
  title: string;
  total: number;
  percent: number;
  price: number;
  color?: string;
  children: ReactNode;
};

function ReportOrderAnalytic({ title, total, icon, color, percent, price, children }: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: 1, minWidth: 200 }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
        {/* <Iconify icon={icon} sx={{ color, width: 24, height: 24, position: 'absolute' }} /> */}
        <IconButton aria-label="delete" sx={{ color, width: 24, height: 24, position: 'absolute' }}>
          {children}
        </IconButton>

        <CircularProgress
          variant="determinate"
          value={percent}
          size={56}
          thickness={4}
          sx={{ color, opacity: 0.48 }}
        />

        <CircularProgress
          variant="determinate"
          value={100}
          size={56}
          thickness={4}
          sx={{ color: 'grey.50016', position: 'absolute', top: 0, left: 0, opacity: 0.48 }}
        />
      </Stack>

      <Stack spacing={0.5} sx={{ ml: 2 }}>
        <Typography variant="h6">{title}</Typography>

        <Typography variant="subtitle2">
          {fShortenNumber(total)}{' '}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Đơn
          </Box>
        </Typography>

        {/* <Typography variant="subtitle2" sx={{ color }}>
          {fCurrency(price)}
        </Typography> */}
      </Stack>
    </Stack>
  );
}

export default ReportOrderAnalytic;
