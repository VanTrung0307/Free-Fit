import {
  Box,
  Card,
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import MapWithMarker from 'components/common/MapWithMarker';
import Details from 'components/Details';
import { IcMarkerLocation } from 'components/map/MarkerStyles';
import TypographyDetails from 'components/TypographyDetails';
import TypographyDetailsStatus from 'components/TypographyDetailsStatus';
import Images from 'constants/image';
import { LatLngExpression } from 'leaflet';
import { Task } from 'models';
import { GetTaskTypeMap } from 'models/dto/taskStatus';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { checkNoEvidence } from 'utils/common';
import '../pages/style.css';

interface DetailsTaskProps {
  task: Task;
}

export default function DetailsTask({ task }: DetailsTaskProps) {
  const { t } = useTranslation();
  const { taskStatusMap } = GetTaskTypeMap();

  return (
    <>
      <Typography variant="h6" gutterBottom marginTop={0} marginBottom={2}>
        {t('task.info')}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            sx={{
              p: 3,
              width: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={9} lg={9}>
                <TypographyDetails title="ID" content={task?.id.toString()} />
                <TypographyDetails title={t('common.creator')} content={task?.creator?.fullname} />

                <TypographyDetails
                  title={t('task.totalItems')}
                  content={
                    task?.batchRoutes
                      .reduce((sum, current) => (sum += current.totalLoads), 0)
                      .toString() || '0'
                  }
                />
                <TypographyDetails
                  title={t('task.totalDistance')}
                  content={
                    task.batchRoutes
                      .reduce((sum, current) => (sum += current.totalDistance), 0)
                      .toString() || '0'
                  }
                />

                <TypographyDetailsStatus
                  title={t('common.status')}
                  content={taskStatusMap[task?.status].name}
                  color={taskStatusMap[task?.status].color}
                />
                <Box mb={2} />
              </Grid>
              <Grid item xs={12} md={3} lg={3}>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  {t('task.agents')}
                </Typography>
                <Stack spacing={2}>
                  {task?.batchRoutes.map((x, idx) => (
                    <Details
                      key={`${t('task.agents')}-${idx}`}
                      icons={x.driver?.image || ''}
                      title={`${t('agent.name')} : ${x.driver?.username}` || ''}
                      sub={`email : ${x.driver?.email}` || ''}
                    />
                  ))}
                </Stack>
                <Box mb={2} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <Typography variant="h6" gutterBottom marginTop={0}>
            {t('task.detailsOrder')}
          </Typography>
          {task.orders.map((x, idx) => (
            <Paper
              sx={{
                p: 3,
                width: 1,
                bgcolor: 'background.neutral',
              }}
              style={{ marginBottom: '16px' }}
              key={`order-${idx}`}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <TypographyDetails
                    title={`${t('common.order')} ${idx + 1}`}
                    content={x.orderCode}
                  />
                  <TypographyDetails title={t('order.receiverName')} content={x?.customerName} />
                  <TypographyDetails title={t('order.email')} content={x?.customerEmail} />
                  <TypographyDetails title={t('order.phone')} content={x?.customerPhone} />
                  <TypographyDetails
                    title={t('task.addressStart')}
                    content={x.fromStation?.address}
                  />
                  <TypographyDetails title={t('task.addressEnd')} content={x.toStation?.address} />
                  <TypographyDetails
                    title={t('order.totalPriceOrder')}
                    content={x.orderInfoObj?.totalPriceOrder.toString() || ''}
                  />
                  <TypographyDetails
                    title={t('order.items')}
                    content={x?.packageItems.length.toString()}
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <ImageList rowHeight={180} style={{ height: '350px' }}>
                    {!checkNoEvidence(x) && (
                      <ImageListItem key="Subheader" cols={2} style={{ height: '100%' }}>
                        <ListSubheader component="div">{t('task.evidence')}</ListSubheader>
                      </ImageListItem>
                    )}

                    {checkNoEvidence(x) ? (
                      <ImageListItem key="no-evidence" cols={2} style={{ height: '100%' }}>
                        <Box style={{ width: '100%', height: '100%' }}>
                          <Box
                            component="img"
                            alt="error"
                            src={Images.NO_EVIDENCE_IMAGE}
                            sx={{
                              top: 0,
                              width: 1,
                              height: 1,
                              borderRadius: 1,
                              objectFit: 'cover',
                              position: 'absolute',
                            }}
                          />
                        </Box>
                        <ImageListItemBar
                          title={t('task.evidence')}
                          subtitle={<span>{t('task.noEvidence')}</span>}
                        />
                      </ImageListItem>
                    ) : (
                      x.packageActions.map((item) =>
                        item.packageEvidences.map((f) => (
                          <ImageListItem key={f.id} cols={2}>
                            <img src={f.imageUrl} alt={`error: ${f.caption}`} />
                            <ImageListItemBar
                              title={f.caption}
                              // subtitle={<span>by: {item.author}</span>}
                              // actionIcon={
                              //   <IconButton
                              //     aria-label={`info about ${item.title}`}
                              //     className={classes.icon}
                              //   >
                              //     <InfoIcon />
                              //   </IconButton>
                              // }
                            />
                          </ImageListItem>
                        ))
                      )
                    )}
                  </ImageList>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Typography variant="h6" gutterBottom marginBottom={2} marginTop={-2}>
            {t('task.depot')}
          </Typography>
          <Paper
            sx={{
              p: 3,
              width: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <TypographyDetails title={t('store.address')} content={task?.depot?.address} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 2 }}>
              <TypographyDetails title={t('adminLevel.province')} content={task?.depot?.city} />
              <TypographyDetails title={t('adminLevel.district')} content={task?.depot?.district} />
              <TypographyDetails title={t('adminLevel.ward')} content={task?.depot?.ward} />
            </Stack>

            <MapWithMarker
              position={
                [Number(task.depot.latitude), Number(task.depot.longitude)] as LatLngExpression
              }
              icon={IcMarkerLocation}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
