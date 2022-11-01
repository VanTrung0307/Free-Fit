import { Box, Container, Grid } from '@mui/material';
import tzVersionApi from 'api/tradeZoneVersionApi';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import useSettings from 'hooks/useSettings';
import { TzVersion } from 'models';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import DetailsTzVersion from '../components/DetailsTzVersion';

export default function TradeZoneVersionDetailsPage() {
  const { tzVersionId } = useParams();
  const [tzVersion, setTzVersion] = useState<TzVersion>();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();

  useEffect(() => {
    if (!tzVersionId) return;

    // IFFE
    (async () => {
      try {
        const data: TzVersion = await tzVersionApi.getById(tzVersionId);
        setTzVersion(data);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, [tzVersionId]);
  return (
    <Page title={t('tz.tzVersionDetails')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('tz.tzVersionDetails')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('tz.tzVersion'), href: PATH_DASHBOARD.tradeZone.tradeZoneVersion },
            {
              name: t('tz.tzVersionDetails'),
            },
            {
              name: tzVersion?.name || '',
            },
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              {tzVersion !== undefined && <DetailsTzVersion tzVersion={tzVersion} />}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
