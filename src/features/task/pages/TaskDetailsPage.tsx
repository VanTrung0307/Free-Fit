import { Box, Container, Grid } from '@mui/material';
import taskApi from 'api/taskAPi';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import useSettings from 'hooks/useSettings';
import { OrderInfo, Task } from 'models';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import DetailsTask from '../components/DetailsTask';
import './style.css';

export default function TaskDetailsPage() {
  const { taskId } = useParams();

  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [task, setTask] = useState<Task>();

  useEffect(() => {
    if (!taskId) return;

    // IFFE
    (async () => {
      try {
        const data: Task = await taskApi.getById(taskId);
        data.orders.forEach((e, idx) => {
          try {
            const obj: OrderInfo = JSON.parse(e.orderInfo);
            data.orders[idx].orderInfoObj = obj;
            // eslint-disable-next-line no-empty
          } catch (error) {}
        });
        setTask(data);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, [taskId]);
  return (
    <Page title={t('task.details')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('task.details')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('task.list'), href: PATH_DASHBOARD.task.root },
            {
              name: t('task.details'),
            },
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              {task !== undefined && <DetailsTask task={task} />}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
