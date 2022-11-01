// material
import { Box, Card, CardHeader, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useAppSelector } from 'app/hooks';
//
import { BaseOptionChart } from 'components/charts';
import { selectFilterReport, selectReport } from 'features/order/orderSlice';
import { merge } from 'lodash';
import { FilterReport } from 'models';
import ReactApexChart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = [currentYear - 3, currentYear - 2, currentYear - 1, currentYear];
interface AnalyticsOrdersProps {
  setFilter: (newFilter: FilterReport) => void;
  // dataReport: OrderReport;
}
const useStyle = makeStyles((theme) => ({
  boxFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'row',
    width: '150px',
  },
}));

export default function AnalyticsOrders({ setFilter }: AnalyticsOrdersProps) {
  const { t } = useTranslation();
  const filterReport = useAppSelector(selectFilterReport);
  // const dataReport = useAppSelector(selectReport);
  const classes = useStyle();
  const CHART_DATA = [
    {
      name: t('dashboard.allOrders'),
      type: 'column',
      data: 0,
    },
    {
      name: t('dashboard.deliveredOrder'),
      type: 'line',
      data: 0,
    },
    {
      name: t('dashboard.cacelOrder'),
      type: 'line',
      data: 0,
    },
  ];
  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid', 'solid', 'solid'] },
    labels: 0,
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y: number) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} ${t('dashboard.order')}`;
          }
          return y;
        },
      },
    },
  });
  const chartOptionsYear = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid', 'solid', 'solid'] },
    labels: 0,
    xaxis: { type: 'string' },
  });
  const handelYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter: FilterReport = {
      ...filterReport,
    };
    setFilter(newFilter);
  };
  const handelMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter: FilterReport = {
      ...filterReport,
    };
    setFilter(newFilter);
  };

  return (
    <Card>
      <CardHeader
        title={t('common.order')}
        subheader={t('dashboard.orderAnalytics')}
        action={
          <Box className={classes.boxFlex}>
            <TextField
              select
              fullWidth
              value={filterReport.date}
              SelectProps={{ native: true }}
              onChange={handelYearChange}
              sx={{
                '& fieldset': { border: '0 !important' },
                '& select': {
                  pl: 1,
                  py: 0.5,
                  pr: '24px !important',
                  typography: 'subtitle2',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0.75,
                  bgcolor: 'background.neutral',
                },
                '& .MuiNativeSelect-icon': {
                  top: 4,
                  right: 0,
                  width: 20,
                  height: 20,
                },
              }}
            >
              {YEAR_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              value={filterReport.date}
              SelectProps={{ native: true }}
              onChange={handelMonthChange}
              sx={{
                '& fieldset': { border: '0 !important' },
                '& select': {
                  pl: 1,
                  py: 0.5,
                  pr: '24px !important',
                  typography: 'subtitle2',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0.75,
                  bgcolor: 'background.neutral',
                },
                '& .MuiNativeSelect-icon': {
                  top: 4,
                  right: 0,
                  width: 20,
                  height: 20,
                },
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((option) =>
                option === 0 ? (
                  <option key={option} value={option}>
                    {t('status.all')}
                  </option>
                ) : (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </TextField>
          </Box>
        }
      />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          type="line"
          series={CHART_DATA}
          options={filterReport.date === '' ? chartOptionsYear : chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}
