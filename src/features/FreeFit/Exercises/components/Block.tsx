import { Box, CardHeader, Typography } from '@mui/material';
// material
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { ReactNode } from 'react';

// ----------------------------------------------------------------------

type LabelProps = {
  title: string;
};

export function Label({ title }: LabelProps) {
  return (
    <Typography variant="overline" component="p" gutterBottom sx={{ color: 'text.secondary' }}>
      {title}
    </Typography>
  );
}

type BlockProps = {
  title?: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
};

export function Block({ title, sx, children }: BlockProps) {
  return (
    <Box sx={{ overflow: 'unset', position: 'unset', width: '100%' }}>
      {title && <CardHeader title={title} />}
      <Box
        sx={{
          p: 3,
          minHeight: 180,
          ...sx,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
