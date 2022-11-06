// material
import { Container, Grid, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  AnalyticsOrders,
  CardTotalError,
  CardTotalInfo,
  CardTotalPrimary,
  CardTotalWarning,
  CurrentActiveVersion,
  OrderStatus,
} from 'components/general-analytics';
// components
import Page from 'components/Page';
import { agentActions, selectAgentList } from 'features/agent/agentSlice';
import { groupZoneActions, selectGroupZoneList } from 'features/group-zone/groupZoneSlice';
import { orderActions, selectFilterReport } from 'features/order/orderSlice';
import { selectStoresResponse, storeActions } from 'features/store-management/storeSlice';
import { selectTaskList, taskActions } from 'features/task/taskSlice';
import DashboardVersionMap from 'features/trade-zone-version/components/DashboardVersionMap';
import { tzVersionActions } from 'features/trade-zone-version/tzVersionSlice';
// hooks
import useSettings from 'hooks/useSettings';
import { ICONS } from 'layouts/dashboard/SidebarConfig';
import { FilterReport, PaginationRequest, TzVersionRequest } from 'models';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------
const initFilter: PaginationRequest = {
  page: undefined,
  colName: undefined,
  keySearch: undefined,
  pageSize: undefined,
  sortType: undefined,
};

export default function Dashboard() {
  const { themeStretch } = useSettings();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // const totalStores = useAppSelector(selectStoresResponse);
  // const totalAgents = useAppSelector(selectAgentList);
  // const totalTasks = useAppSelector(selectTaskList);
  // const totalAreas = useAppSelector(selectGroupZoneList);
  // const filterReport = useAppSelector(selectFilterReport);
  // console.log(filterReport);
  // useEffect(() => {
  //   dispatch(storeActions.fetchStores(initFilter));
  //   dispatch(agentActions.fetchAgentList(initFilter));
  //   dispatch(taskActions.fetchTaskList(initFilter));
  //   dispatch(groupZoneActions.fetchGroupZoneList());
  //   dispatch(orderActions.fetchOrderList(initFilter));
  //   dispatch(
  //     tzVersionActions.fetchTzVersionList({ ...initFilter, storeId: 0 } as TzVersionRequest)
  //   );
  // }, [dispatch]);

  // useEffect(() => {
  //   dispatch(orderActions.fetchOrderReport(filterReport));
  // }, [dispatch, filterReport]);

  const handelFilterChange = (newFilter: FilterReport) => {
    // dispatch(orderActions.setFilterOrderReport(newFilter));
  };
  return (
    <Page title="Dashboard: Analytics | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          {t('login.welcome')}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <CardTotalPrimary
              icon={ICONS.store}
              label={t('dashboard.totalStores')}
              // total={totalStores?.results?.length || 0}
              total={0}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <CardTotalInfo
              icon={ICONS.groupZone}
              label={t('dashboard.totalAreas')}
              // total={totalAreas?.features?.length || 0}
              total={0}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <CardTotalWarning
              icon={ICONS.task}
              label={t('dashboard.totalTask')}
              // total={totalTasks?.results?.length || 0}
              total={0}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <CardTotalError
              icon={ICONS.agent}
              label={t('dashboard.totalAgentsActive')}
              // total={totalAgents?.results?.length || 0}
              total={0}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            {/* <AnalyticsOrders setFilter={handelFilterChange} /> */}
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            {/* <OrderStatus /> */}
          </Grid>
          <Grid item xs={12} md={5} lg={5}>
            {/* <CurrentActiveVersion /> */}
          </Grid>
          <Grid item xs={12} md={7} lg={7}>
            {/* <DashboardVersionMap /> */}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
