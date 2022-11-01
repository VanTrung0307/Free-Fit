import { Box, Stack, Typography } from '@mui/material';
import Images from 'constants/image';

interface DetailsProps {
  icons: any;
  title: string;
  sub: string;
  leftText?: string;
}

export default function Details({ icons, sub, title, leftText }: DetailsProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        sx={{
          width: 60,
          height: 60,
          flexShrink: 0,
          display: 'flex',
          borderRadius: 1.5,
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.neutral',
        }}
      >
        <Box
          component="img"
          alt="error"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = Images.ERROR_IMG;
          }}
          src={icons}
        />
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 160 }}>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {sub}
        </Typography>
      </Box>

      {leftText && (
        <Stack alignItems="flex-end" sx={{ pr: 3 }}>
          <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
            {leftText}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}

// export default function ListDetails({ list, title }: ListDetailsProps) {
//   return (
//     <>
//       <CardHeader title={title} />
//       <Scrollbar>
//         <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
//           {list.map((app, idx) => (
//             <Details key={title+'-'+idx}  />
//           ))}
//         </Stack>
//       </Scrollbar>
//     </>
//   );
// }
