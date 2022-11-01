import { Box, Grid, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import config from './config';
import ReportOrderAnalytic from './ReportOrderAnalytic';
import TableCard, { MiniTableCard } from './TableCard';

function ReportOverview({ dateRange, done, setLoading, loading, data }: any) {
  const revenueData = [];
  const theme = useTheme();

  return (
    <>
      <Stack spacing={4} minHeight="50vh">
        <Stack spacing={4}>
          {/* I. Bán hàng */}
          <Stack spacing={2} px={2}>
            {/* <Typography pl={2} variant="h4">
              I. Báo cáo đơn hàng
            </Typography> */}

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TableCard
                    title="Tổng số hóa đơn bán hàng"
                    subtitle="Đơn vị (Hóa đơn)"
                    bc="reportPalette.blue1"
                    bch="reportPalette.blue2"
                    column={config.totalSalesInvoice}
                    data={data}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TableCard
                    title="Tổng doanh thu bán hàng"
                    subtitle="Đơn vị (VNĐ)"
                    bc="reportPalette.green1"
                    bch="reportPalette.green2"
                    column={config.totalSalesRevenue}
                    data={data}
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Stack>

        {/* <Stack spacing={2}>
          <Typography pl={2} variant="h4">
            IV. Thanh Toán & Thu Ngân
          </Typography>

          <Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TableCard
                  title="Tổng thanh toán"
                  subtitle="(1) + (2) + (3) + (4) + (5) + (6)| Đơn vị (VNĐ)"
                  bc="reportPalette.purple1"
                  bch="reportPalette.purple2"
                  column={config.totalPayment}
                  data={revenueData}
                />
              </Grid>
              <Grid item xs={6}>
                <TableCard
                  title="Tổng lượt thanh toán"
                  subtitle="(1) + (2) + (3) + (4) + (5) + (6)| Đơn vị (Hóa đơn)"
                  bc="reportPalette.blue1"
                  bch="reportPalette.blue2"
                  column={config.totalAmountPayment}
                  data={revenueData}
                />
              </Grid>
            </Grid>
          </Box>
        </Stack> */}
      </Stack>
    </>
  );
}

export default ReportOverview;
