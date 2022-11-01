import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Label, { LabelColor } from './Label';

interface TypographyDetailsStatusProps {
  title: string;
  content?: string;
  color?: string;
}

export default function TypographyDetailsStatus({
  title,
  content,
  color,
}: TypographyDetailsStatusProps) {
  const { t } = useTranslation();
  let status: LabelColor = 'success';
  if (color === 'red') {
    status = 'error';
  } else if (color === 'goldenrod') {
    status = 'warning';
  }
  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        textAlign: 'center',
        flexDirection: 'row',
      }}
    >
      <Typography variant="body1" sx={{ color: 'text.secondary' }} component="span">
        {title}&nbsp;:&nbsp;
      </Typography>
      {/* <Typography variant="h5" sx={{ color: 'text.secondary' }}>
        {content === undefined || content === '' ? t('common.noData') : content}
      </Typography> */}
      <Label color={status}>
        {/* {content === undefined || content === '' ? t('common.noData') : content} */}
        <Typography variant="body1">
          {content === undefined || content === '' ? t('common.noData') : content}
        </Typography>
      </Label>
    </Box>
  );
}
