import { DatePicker, DateRange, DateRangePicker, TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Card, Tab, TextField } from '@mui/material';
import axiosClient from 'api/axiosClient';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import Page from 'components/Page';
import { toDate } from 'date-fns';
import {
  orderActions,
  selectReportByDateResponse,
  selectReportFilter,
  selectReportFilterInRange,
  selectReportInRangeResponse,
} from 'features/order/orderSlice';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { parseParams } from 'utils/axios';
import ReportBtn from './components/ReportBtn';
import ReportOverview from './components/ReportOverview';

export default function Report() {
  const today = new Date();
  const yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);
  const [dateRange, setDateRange] = useState<DateRange<Date>>([yesterday, yesterday]);
  const [done, setDone] = useState(true);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const reportFilterInRange = useAppSelector(selectReportFilterInRange);
  const reportInRange = useAppSelector(selectReportInRangeResponse);
  const [date, setDate] = useState({
    fromDate: '',
    toDate: '',
  });

  useEffect(() => {
    dispatch(orderActions.fetchReportInRange(reportFilterInRange));
  }, [dispatch, reportFilterInRange]);

  const onPickDate = (from: string, to: string) => {
    dispatch(
      orderActions.setReportFilterInRange({
        ...reportFilterInRange,
        // dayReport: e,
        fromDate: from,
        toDate: to,
      })
    );
  };
  const [activeTab, setActiveTab] = useState('1');
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const onExportExcel = () => {
    axiosClient
      .get(
        `${
          process.env.REACT_APP_API_URL || 'https://localhost:5001/api/v1.0'
        }/orders/report/export?${parseParams(date)}`,
        {
          method: 'GET',
          responseType: 'blob', // important
        }
      )
      .then((response) => {
        console.log(response.data);
        const url = window.URL.createObjectURL(new Blob([response as any]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `Báo_Cáo_Đơn_Hàng_Theo_Ngày ${date?.fromDate}-${date?.toDate}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
      });
    // window.open(`https://localhost:5001/api/v1.0/orders/report/export?${parseParams(date)}`);
  };

  return (
    <>
      <Page
        title={`Báo cáo tổng quan`}
        isTable
        actions={() => [
          <DateRangePicker
            inputFormat="dd/MM/yyyy"
            minDate={moment(`${today.getFullYear()}/${today.getMonth()}/01`).toDate()}
            // disabled={loading}
            disableCloseOnSelect
            disableFuture
            value={dateRange}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} label="Từ" />
                <Box sx={{ mx: 2 }}> - </Box>
                <TextField {...endProps} label="Đến" />
              </>
            )}
            onChange={(e) => {
              if (e[0] && e[1]) {
                setDateRange(e);
                setDate({
                  fromDate: moment(e[0]).format('YYYY/MM/DD'),
                  toDate: moment(e[1]).format('YYYY/MM/DD'),
                });
              }
              onPickDate(moment(e[0]).format('YYYY/MM/DD'), moment(e[1]).format('YYYY/MM/DD'));
            }}
            onOpen={() => setDone(false)}
            onClose={() => setDone(true)}
            key="date-range"
          />,
          // <DatePicker
          //     inputFormat="dd/MM/yyyy"
          //     renderInput={(params) => <TextField {...params} />}
          //     minDate={moment(`${today.getFullYear()}/${today.getMonth()}/01`).toDate()}
          //     // disabled={loading}
          //     disableCloseOnSelect
          //     disableFuture
          //     value={dateRange[0]}
          //     onChange={(e) => {
          //       if (e) {
          //         setDateRange([e, e]);
          //       }
          //       onPickDate(moment(e).format('YYYY/MM/DD'));
          //     }}
          //     onOpen={() => setDone(false)}
          //     onClose={() => setDone(true)}
          //     key="date-range"
          //   />
          <ReportBtn key="export-excel" onClick={onExportExcel} />,
        ]}
      >
        <Card sx={{ paddingBottom: 5 }}>
          <ReportOverview
            dateRange={dateRange}
            done={done}
            loading={loading}
            setLoading={setLoading}
            data={reportInRange}
          />
        </Card>
      </Page>
    </>
  );
}
