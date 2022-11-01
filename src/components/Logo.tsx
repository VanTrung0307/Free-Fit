// material
import { Box, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

export default function Logo({ sx }: BoxProps) {
  return (
    <Box
      component="img"
      src="/static/logo-cardioworkout.png"
      sx={{ width: 60, height: 40, ...sx }}
    />
  );
}
