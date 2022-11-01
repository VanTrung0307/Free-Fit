import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { forwardRef, useEffect, useCallback, ReactNode } from 'react';
// material
import { Box, BoxProps, Container, Stack, Typography } from '@mui/material';
// utils
import track from '../utils/analytics';

// ----------------------------------------------------------------------

interface PageProps extends BoxProps {
  children: ReactNode;
  title?: string;
  content?: ReactNode;
  actions?: () => ReactNode[];
  isTable?: boolean;
}

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, title = '', content, actions, isTable, ...other }, ref) => {
    const { pathname } = useLocation();

    const sendPageViewEvent = useCallback(() => {
      track.pageview({
        page_path: pathname,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      sendPageViewEvent();
    }, [sendPageViewEvent]);

    return (
      <>
        <Helmet>
          <title>{title} | Cardio Workout</title>
        </Helmet>

        <Box ref={ref} {...other}>
          {/* <Container maxWidth="lg" sx={{ mx: 'auto' }}> */}
          <Box pb={4}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              {isTable && <Typography variant="h3">{title}</Typography>}
              <Stack direction="row" spacing={2}>
                {actions && actions()}
              </Stack>
            </Stack>
            {content}
          </Box>
          {children}
          {/* </Container> */}
        </Box>
      </>
    );
  }
);

export default Page;
