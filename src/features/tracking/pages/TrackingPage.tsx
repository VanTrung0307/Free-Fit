// material
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Checkbox,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import mapApi from 'api/mapApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// components
import Page from 'components/Page';
import { LayerActive } from 'constants/layer';
import { agentActions, selectAgentList, selectFilter } from 'features/agent/agentSlice';
// hooks
import useSettings from 'hooks/useSettings';
import 'leaflet/dist/leaflet.css';
import {
  AgentPagingRequest,
  GeoJSONMarker,
  GetStatusMap,
  RequestBounds,
  Tracking,
  TrackingAgent,
} from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import { app } from 'utils/initFirebase';
import { getDatabase, ref, onValue, limitToLast, query, get } from 'firebase/database';
import EmptyContent from 'components/EmptyContent';
import { splitLongString } from 'utils/common';
import TrackingMap from '../components/TrackingMap';
import TrackingFilter from '../components/TrackingFilter';

// ----------------------------------------------------------------------

export default function TrackingPage() {
  const { themeStretch } = useSettings();
  const { t } = useTranslation();
  const [poisLayer, setPoisLayer] = useState<GeoJSONMarker>();
  const [myStoreLayer, setMyStoreLayer] = useState<GeoJSONMarker>();
  const [storesLayer, setStoreLayer] = useState<GeoJSONMarker>();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const rs = useAppSelector(selectAgentList);
  const [listSelect, setListSelect] = useState<Number[]>([]);
  const [trackings, setTracking] = useState<TrackingAgent[]>([]);
  const { statusMapAgent } = GetStatusMap();
  const filter = useAppSelector(selectFilter);

  const db = getDatabase(app);
  const list: Tracking[] = [];
  useEffect(() => {
    dispatch(agentActions.fetchAgentList({ ...filter, keySearch: undefined }));
  }, [dispatch, filter]);
  useEffect(() => {
    listSelect.forEach((f) => {
      const agent = rs.results.find((x) => x.id === f);
      const dbRef = ref(db, `drivers/${f}`);
      // const usersSnapshot = await get(query(dbRef, ...[limitToLast(3)]));
      onValue(query(dbRef, ...[limitToLast(1)]), (snapshot) => {
        if (snapshot.val() === null) {
          enqueueSnackbar(t('tracking.noData'), { variant: 'warning' });
        }
        list.splice(0, list.length);
        snapshot.forEach((childSnapshot) => {
          // var childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          list.push({
            latitude: childData.latitude,
            longitude: childData.longitude,
            time: childData.time,
          });
        });
        if (agent !== undefined) {
          const newList = [...trackings];
          const index = newList.findIndex((g) => g.agent.id === agent.id);
          if (index === -1) {
            newList.push({
              agent,
              locations: list,
            });
          } else {
            newList.splice(index, 1);
            newList.push({
              agent,
              locations: list,
            });
          }
          setTracking(newList);
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSelect]);
  const handleToggle = (value: number) => () => {
    const newList = [...listSelect];
    const index = newList.findIndex((x) => x === value);
    if (index !== -1) {
      newList.splice(index, 1);
      setListSelect(newList);
      const newTrackings = [...trackings];
      const indexTracking = newTrackings.findIndex((x) => x.agent.id === value);
      newTrackings.splice(indexTracking, 1);
      setTracking(newTrackings);
    } else {
      newList.push(value);
      setListSelect(newList);
    }
  };
  const handelOnChangeBounds = async (bounds: string) => {
    if (storesLayer) {
      getStoresLayer(bounds);
    }
    if (poisLayer) {
      getPoisLayer(bounds);
    }
  };
  const handelLayerActive = async (active: LayerActive, boundsBox: string) => {
    switch (active) {
      case LayerActive.Pois:
        getPoisLayer(boundsBox);
        return;
      case LayerActive.Stores: {
        getStoresLayer(boundsBox);
        return;
      }
      case LayerActive.MyStore: {
        getMyStoreLayer();
      }
    }
  };
  const handelRemoveLayer = (active: LayerActive) => {
    switch (active) {
      case LayerActive.Pois:
        setPoisLayer(undefined);
        return;
      case LayerActive.Stores: {
        setStoreLayer(undefined);
        return;
      }
      case LayerActive.MyStore: {
        setMyStoreLayer(undefined);
      }
    }
  };
  const getPoisLayer = async (boundsBox: string) => {
    try {
      const data: GeoJSONMarker = await mapApi.getPois({
        coordinateString: boundsBox,
      } as RequestBounds);
      setPoisLayer(data);
    } catch (error) {
      enqueueSnackbar(t('common.errorText'), { variant: 'error' });
    }
  };
  const getStoresLayer = async (boundsBox: string) => {
    try {
      const data: GeoJSONMarker = await mapApi.getStores({
        coordinateString: boundsBox,
      } as RequestBounds);
      setStoreLayer(data);
    } catch (error) {
      enqueueSnackbar(t('common.errorText'), { variant: 'error' });
    }
  };
  const getMyStoreLayer = async () => {
    try {
      const data: GeoJSONMarker = await mapApi.getMyStores();
      setMyStoreLayer(data);
    } catch (error) {
      enqueueSnackbar(t('common.errorText'), { variant: 'error' });
    }
  };
  const handelFilterChange = (newFilter: AgentPagingRequest) => {
    dispatch(agentActions.setFilter(newFilter));
  };
  return (
    <Page title={t('tracking.title')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('tracking.title')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('tracking.title') },
          ]}
        />
      </Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <TrackingFilter filter={filter} onChange={handelFilterChange} />
            <Grid container>
              {rs.results?.length === 0 && (
                <Grid item xs={12} md={12} lg={12}>
                  <Box width="100%">
                    <EmptyContent
                      title={t('common.noData')}
                      sx={{
                        width: '100%',
                      }}
                    />
                  </Box>
                </Grid>
              )}
              {rs.results?.map((value) => (
                <Grid item xs={6} md={4} lg={3} key={`checkbox-list-secondary-label${value.id}`}>
                  <List dense key={`checkbox-list-label${value.id}`}>
                    <ListItem key={value.id} button alignItems="flex-start">
                      <ListItemIcon>
                        <Checkbox
                          edge="end"
                          onChange={handleToggle(value.id)}
                          checked={listSelect.find((x) => x === value.id) !== undefined}
                          inputProps={{
                            'aria-labelledby': `checkbox-list-secondary-label${value.id}`,
                          }}
                        />
                      </ListItemIcon>
                      <ListItemAvatar>
                        <Avatar alt={`Avatar n°${value.id}`} src={value.image} />
                      </ListItemAvatar>
                      <ListItemText
                        id={`checkbox-list-secondary-label${value.id}`}
                        primary={`${splitLongString(value.username, 20)}-(${value.licencePlate})`}
                        secondary={
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color={statusMapAgent[value.status].color}
                          >
                            {statusMapAgent[value.status].name}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
              ))}
            </Grid>
            {/* <List dense>
              {rs.results?.length === 0 && (
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 0.5, color: 'text.secondary', textAlign: 'center' }}
                >
                  {t('common.noData')}
                </Typography>
              )}
              {rs.results?.map((value) => {
                const labelId = `checkbox-list-secondary-label${value.id}`;
                return (
                  <ListItem key={value.id} button>
                    <ListItemIcon>
                      <Checkbox
                        edge="end"
                        onChange={handleToggle(value.id)}
                        checked={listSelect.find((x) => x === value.id) !== undefined}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemAvatar>
                      <Avatar alt={`Avatar n°${value.id}`} src={value.image} />
                    </ListItemAvatar>
                    <ListItemText
                      id={labelId}
                      primary={`${value.username}(${value.licencePlate})`}
                    />
                    <ListItemSecondaryAction id={`status-${labelId}`}>
                      <Box color={statusMapAgent[value.status].color}>
                        {statusMapAgent[value.status].name}
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List> */}
          </Card>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TrackingMap
            onChangeBounds={handelOnChangeBounds}
            stores={storesLayer || undefined}
            myStore={myStoreLayer || undefined}
            pois={poisLayer || undefined}
            onActiveLayer={handelLayerActive}
            onCloseLayer={handelRemoveLayer}
            trackings={trackings}
          />
        </Grid>
      </Grid>
    </Page>
  );
}
