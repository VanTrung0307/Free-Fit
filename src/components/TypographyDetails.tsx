import { Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface TypographyDetailsProps {
  title: string;
  content?: string;
}

export default function TypographyDetails({ title, content }: TypographyDetailsProps) {
  const { t } = useTranslation();
  return (
    <Typography variant="body1" gutterBottom>
      <Typography variant="body1" component="span" sx={{ color: 'text.secondary' }}>
        {title}&nbsp;:&nbsp;
      </Typography>
      {content === undefined || content === '' ? t('common.noData') : content}
    </Typography>
  );
}
