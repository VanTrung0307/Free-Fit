import arrowCircleRightFill from '@iconify/icons-eva/arrow-circle-right-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
import StorefrontIcon from '@mui/icons-material/Storefront';
import editFill from '@iconify/icons-eva/edit-fill';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Label from 'components/Label';
import TypographyDetails from 'components/TypographyDetails';
import TypographyDetailsStatus from 'components/TypographyDetailsStatus';
import { TzVersion } from 'models';
import { GetConstantTimeFilter } from 'models/dto/timeFilter';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { convertTimeFilter, parseDateFilterDisplay } from 'utils/common';
import DetailsTradeZoneInVersion from './DetailsTradeZoneInVersion';

const useStyle = makeStyles((theme) => ({
  boxFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'row',
  },
}));

interface DetailsTzVersionProps {
  tzVersion: TzVersion;
}

export default function DetailsTzVersion({ tzVersion }: DetailsTzVersionProps) {
  const { t } = useTranslation();
  const { dateFilter } = GetConstantTimeFilter();
  const classes = useStyle();
  const navigate = useNavigate();

  return (
    <>
      <CardHeader
        title={t('tz.info')}
        style={{ padding: '0px 0px 16px 0px' }}
        action={
          <Button
            component={RouterLink}
            variant="text"
            to={`${PATH_DASHBOARD.tradeZone.tzVersionEdit}/${tzVersion.id}`}
            startIcon={<Icon icon={editFill} />}
          >
            {`${t('common.editInfo')} ${tzVersion.name}`}
          </Button>
        }
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            key="tz-version-info"
            sx={{
              p: 3,
              width: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <Grid container>
              <Grid item xs={12} md={6} lg={6}>
                <TypographyDetails title="ID" content={tzVersion?.id.toString()} />
                <TypographyDetails title={t('tz.tzVerName')} content={tzVersion?.name} />
                <TypographyDetails title={t('groupZone.name')} content={tzVersion?.groupZoneName} />
                <TypographyDetails
                  title={t('common.description')}
                  content={tzVersion?.description}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Box mb={1} className={classes.boxFlex}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }} component="span">
                    {t('tz.dateFilter')}&nbsp;:&nbsp;
                  </Typography>
                  {parseDateFilterDisplay(tzVersion.dateFilter).map((f) => (
                    <Label key={`${f.start}`} color="info" style={{ marginRight: '8px' }}>
                      <Typography variant="subtitle1" key={`typo-date-${f.start}`}>
                        {f.end !== -1
                          ? `${dateFilter[f.start]}->${dateFilter[f.end]}`
                          : `${dateFilter[f.start]}`}
                      </Typography>
                    </Label>
                  ))}
                </Box>
                <Box mb={1} className={classes.boxFlex}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }} component="span">
                    {t('tz.timeFilter')}&nbsp;:&nbsp;
                  </Typography>
                  {convertTimeFilter(tzVersion.timeSlot).map((f) => (
                    <Label key={`${f.start}`} color="warning" style={{ marginRight: '8px' }}>
                      <Typography variant="subtitle1" key={`typo-${f.start}`}>
                        {`${f.start}->${f.end}`}{' '}
                      </Typography>
                    </Label>
                  ))}
                </Box>
                {/* <Box mb={1} className={classes.boxFlex}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }} component="span">
                    {t('tz.storesApply')}&nbsp;:&nbsp;
                  </Typography>
                  {tzVersion?.storesName?.length === 0
                    ? t('store.none')
                    : tzVersion?.storesName?.map((f) => (
                        <Chip
                          key={f.id}
                          variant="outlined"
                          icon={<StorefrontIcon />}
                          label={f.name}
                          color="primary"
                          size="small"
                          style={{ marginRight: '4px' }}
                        />
                      ))}
                </Box> */}
                <TypographyDetailsStatus
                  title={t('common.status')}
                  content={tzVersion.isActive ? t('tz.active') : t('tz.unActive')}
                  color={tzVersion.isActive ? 'green' : 'red'}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            key="tz-version-info"
            sx={{
              p: 3,
              width: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              {t('tz.storesApply')}
            </Typography>
            {tzVersion?.storesName?.length === 0
              ? t('store.none')
              : tzVersion?.storesName?.map((f) => (
                  <Chip
                    key={f.id}
                    variant="outlined"
                    icon={<StorefrontIcon />}
                    label={f.name}
                    color="primary"
                    size="small"
                    style={{ marginRight: '4px' }}
                  />
                ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Card style={{ padding: '8px 8px 0px 8px' }}>
            <CardHeader
              title={t('tz.tzList')}
              action={
                <>
                  <Tooltip key="page-list" title={t('tz.tzList') || ''}>
                    <IconButton
                      color="info"
                      onClick={() => {
                        navigate(`${PATH_DASHBOARD.tradeZone.tradeZones}`);
                      }}
                      size="large"
                    >
                      <Icon icon={arrowCircleRightFill} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip key="add-new-item" title={t('tz.addTitleTz') || ''}>
                    <IconButton
                      color="success"
                      onClick={() => {
                        navigate(`${PATH_DASHBOARD.tradeZone.addTz}`);
                      }}
                      size="large"
                    >
                      <Icon icon={plusFill} />
                    </IconButton>
                  </Tooltip>
                </>
              }
              style={{ padding: '16px' }}
            />
            <DetailsTradeZoneInVersion tzVersion={tzVersion} />
            <Box mb={2} />
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
