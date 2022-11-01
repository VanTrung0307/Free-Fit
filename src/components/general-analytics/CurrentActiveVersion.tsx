import StorefrontIcon from '@mui/icons-material/Storefront';
import { Box, CardHeader, Chip, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import EmptyContent from 'components/EmptyContent';
import Label from 'components/Label';
import TypographyDetails from 'components/TypographyDetails';
import { selectTzVersionCurrentActive } from 'features/trade-zone-version/tzVersionSlice';
import { tradeZoneActions } from 'features/trade-zone/tradeZoneSlice';
import { PaginationRequest } from 'models';
import { GetConstantTimeFilter } from 'models/dto/timeFilter';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { convertTimeFilter, parseDateFilterDisplay } from 'utils/common';

// ----------------------------------------------------------------------
const useStyle = makeStyles((theme) => ({
  boxFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'row',
  },
}));
const initFilter: PaginationRequest = {
  page: undefined,
  colName: undefined,
  keySearch: undefined,
  pageSize: undefined,
  sortType: undefined,
};
export default function CurrentActiveVersion() {
  const { t } = useTranslation();
  const currentActive = useAppSelector(selectTzVersionCurrentActive);
  const classes = useStyle();
  const { dateFilter } = GetConstantTimeFilter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!currentActive?.id) return;

    dispatch(
      tradeZoneActions.fetchTradeZoneList({
        ...initFilter,
        groupZoneId: 0,
        tradeZoneVersionId: currentActive.id,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentActive]);

  return (
    <Paper
      sx={{
        p: 3,
        width: 1,
        bgcolor: 'background.neutral',
      }}
    >
      <CardHeader title={t('dashboard.currentActive')} style={{ padding: '0px 0px 16px 0px' }} />
      {currentActive ? (
        <>
          <TypographyDetails title={t('tz.tzVerName')} content={currentActive?.name} />
          <Box mb={1} className={classes.boxFlex}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }} component="span">
              {t('tz.dateFilter')}&nbsp;:&nbsp;
            </Typography>
            {parseDateFilterDisplay(currentActive.dateFilter).map((f) => (
              <Label key={`${f.start}`} color="info" style={{ marginRight: '8px' }}>
                <Typography
                  variant="body1"
                  sx={{ color: 'text.secondary' }}
                  component="span"
                  key={`typo-date-${f.start}`}
                >
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
            {convertTimeFilter(currentActive.timeSlot).map((f) => (
              <Label key={`${f.start}`} color="warning" style={{ marginRight: '8px' }}>
                <Typography
                  variant="body1"
                  sx={{ color: 'text.secondary' }}
                  component="span"
                  key={`typo-${f.start}`}
                >
                  {`${f.start}->${f.end}`}{' '}
                </Typography>
              </Label>
            ))}
          </Box>
          {/* <Box mb={1} className={classes.boxFlex}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }} component="span">
              {t('tz.storesApply')}&nbsp;:&nbsp;
            </Typography>
            {currentActive?.storesName?.length === 0
              ? t('store.none')
              : currentActive?.storesName?.map((f) => (
                  <Chip
                    key={f.id}
                    variant="outlined"
                    icon={<StorefrontIcon />}
                    label={f.name}
                    size="small"
                    color="primary"
                    style={{ marginRight: '4px' }}
                  />
                ))}
          </Box> */}
          <TypographyDetails title={t('groupZone.name')} content={currentActive?.groupZoneName} />
          <Typography variant="subtitle1" gutterBottom>
            {t('tz.storesApply')}
          </Typography>
          {currentActive?.storesName?.length === 0
            ? t('store.none')
            : currentActive?.storesName?.map((f) => (
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
        </>
      ) : (
        <>
          <Box width="100%">
            <EmptyContent
              title={t('common.noData')}
              sx={{
                width: '100%',
              }}
            />
          </Box>
        </>
      )}
    </Paper>
  );
}
