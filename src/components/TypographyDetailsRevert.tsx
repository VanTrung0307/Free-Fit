import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface TypographyDetailsProps {
  title: string;
  content?: string;
}

export default function TypographyDetailsRevert({ title, content }: TypographyDetailsProps) {
  const { t } = useTranslation();
  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        textAlign: 'left',
        flexDirection: 'row',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}&nbsp;:&nbsp;
      </Typography>
      <Typography variant="h6" gutterBottom>
        {content === undefined || content === '' ? t('common.noData') : content}
      </Typography>
    </Box>
  );
}
