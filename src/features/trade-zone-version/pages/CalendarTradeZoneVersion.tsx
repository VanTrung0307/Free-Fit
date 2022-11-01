import FullCalendar, { EventClickArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
import tagsFilled from '@iconify/icons-ant-design/tags-filled';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Container,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
// material
import { useTheme } from '@mui/material/styles';
import StorefrontIcon from '@mui/icons-material/Storefront';
import mapApi from 'api/mapApi';
import storeApi from 'api/storeApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { DialogAnimate } from 'components/animate';
import { CalendarStyle, CalendarToolbar } from 'components/dashboard/calendar';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// components
import Page from 'components/Page';
import { LayerActive } from 'constants/layer';
import { storeActions } from 'features/store-management/storeSlice';
import ViewTradeZoneMap from 'features/trade-zone/components/TradeZoneViewMap';
// hooks
import useSettings from 'hooks/useSettings';
import { GeoJSONMarker, RequestBounds, TradeZone, TzVersionRequest } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
// routes
import { PATH_DASHBOARD } from 'routes/paths';
// @types
import TypographyDetails from 'components/TypographyDetails';
import { CalendarView } from '../../../@types/calendar';
import {
  selectedEventSelector,
  selectedOpenModal,
  selectFilter,
  selectTzVersionEvents,
  tzVersionActions,
} from '../tzVersionSlice';

// ----------------------------------------------------------------------

export default function CalendarTradeZoneVersion() {
  const { themeStretch } = useSettings();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xl'));
  const calendarRef = useRef<FullCalendar>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(isMobile ? 'listWeek' : 'timeGridWeek');
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectTzVersionEvents);
  const language = localStorage.getItem('language');
  const { t } = useTranslation();
  const filter = useAppSelector(selectFilter);
  const selectedEvent = useAppSelector(selectedEventSelector);
  const isOpenModal = useAppSelector(selectedOpenModal);
  const [poisLayer, setPoisLayer] = useState<GeoJSONMarker>();
  const [myStoreLayer, setMyStoreLayer] = useState<GeoJSONMarker>();
  const [storesLayer, setStoreLayer] = useState<GeoJSONMarker>();
  const { enqueueSnackbar } = useSnackbar();
  const [listTz, setListTz] = useState<TradeZone[]>();

  const [listSelect, setListSelect] = useState<Number[]>([]);

  useEffect(() => {
    dispatch(storeActions.fetchStores({}));
  }, [dispatch]);
  useEffect(() => {
    dispatch(
      tzVersionActions.fetchTzVersionList({
        ...filter,
        groupZoneId: 0,
      })
    );
  }, [dispatch, filter]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isMobile ? 'listWeek' : 'timeGridWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isMobile]);

  const handleChangeView = (newView: CalendarView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleSelectEvent = async (arg: EventClickArg) => {
    try {
      const data: TradeZone[] = await storeApi.getStoreTradeZones(filter.storeId.toString());
      setListTz(data);
    } catch (error) {
      enqueueSnackbar(t('common.errorText'), { variant: 'error' });
    }
    const newList = [...listSelect];
    newList.push(Number(arg.event.id));
    setListSelect(newList);
    dispatch(tzVersionActions.selectEvent(arg.event.id));
  };

  const handleCloseModal = () => {
    dispatch(tzVersionActions.closeModal());
  };
  const handelFilterChange = (newFilter: TzVersionRequest) => {
    dispatch(tzVersionActions.setFilterWithDebounce(newFilter));
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

  const handleToggle = (value: number) => () => {
    const newList = [...listSelect];
    const index = newList.findIndex((x) => x === value);
    if (index !== -1) {
      newList.splice(index, 1);
      setListSelect(newList);
    } else {
      newList.push(value);
      setListSelect(newList);
    }
  };

  return (
    <Page title={t('tz.calendar')}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={t('tz.calendar')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('tz.calendar') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.tradeZone.add}
              startIcon={<Icon icon={plusFill} width={20} height={20} />}
            >
              {t('tz.add')}
            </Button>
          }
        />

        <Card>
          <CalendarStyle>
            <CalendarToolbar
              date={date}
              view={view}
              onChangeView={handleChangeView}
              onChange={handelFilterChange}
            />
            <FullCalendar
              weekends
              editable
              droppable
              selectable
              events={events}
              ref={calendarRef}
              rerenderDelay={10}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              headerToolbar={false}
              allDayMaintainDuration
              eventClick={handleSelectEvent}
              eventResizableFromStart
              height={isMobile ? 'auto' : 720}
              allDaySlot={false}
              firstDay={1}
              locale={language || 'vi'}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short',
              }}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
          </CalendarStyle>
        </Card>

        <DialogAnimate open={isOpenModal} onClose={handleCloseModal} maxWidth="lg" fullWidth>
          <DialogTitle>{t('tz.infoTz')}</DialogTitle>

          <DialogContent sx={{ pb: 0, overflowY: 'unset' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4} lg={4}>
                <Box mt={2} />
                <Paper
                  key="tz-version-info"
                  sx={{
                    p: 3,
                    width: 1,
                    bgcolor: 'background.neutral',
                  }}
                >
                  <TypographyDetails title="ID" content={selectedEvent?.id?.toString() || ''} />
                  <TypographyDetails
                    title={t('tz.tzVerName')}
                    content={selectedEvent?.title || ''}
                  />
                </Paper>
                <Box mt={2} />
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
                  <Chip
                    key={selectedEvent?.tz?.storeId || 0}
                    variant="outlined"
                    icon={<StorefrontIcon />}
                    label={selectedEvent?.tz?.storeName}
                    color="primary"
                  />
                </Paper>
                {/* <Typography variant="h6" gutterBottom marginBottom={2}>
                  {t('tz.storesApply')}
                </Typography>

                <Chip
                  key={selectedEvent?.tz?.storeId || 0}
                  variant="outlined"
                  icon={<StorefrontIcon />}
                  label={selectedEvent?.tz?.storeName}
                  color="primary"
                /> */}

                <Typography variant="h6" gutterBottom marginTop={2}>
                  {t('tz.anotherTz')}
                </Typography>
                <List dense>
                  {listTz?.map((value) => {
                    const labelId = `checkbox-list-secondary-label-$${value.storeId} ${value.tradeZoneVersionId}`;
                    return (
                      <ListItem key={`${value.storeId} ${value.tradeZoneVersionId}`} button>
                        <ListItemAvatar>
                          <Icon icon={tagsFilled} />
                        </ListItemAvatar>
                        <ListItemText id={labelId} primary={`Trade zone: ${value.name}`} />
                        <ListItemSecondaryAction>
                          <Checkbox
                            edge="end"
                            onChange={handleToggle(value.tradeZoneVersionId)}
                            checked={
                              listSelect.find((x) => x === value.tradeZoneVersionId) !== undefined
                            }
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
              <Grid item xs={12} md={8} lg={8}>
                {Boolean(selectedEvent?.tz) && (
                  <ViewTradeZoneMap
                    onChangeBounds={handelOnChangeBounds}
                    stores={storesLayer || undefined}
                    myStore={myStoreLayer || undefined}
                    pois={poisLayer || undefined}
                    onActiveLayer={handelLayerActive}
                    onCloseLayer={handelRemoveLayer}
                    selectedTradeZone={selectedEvent?.tz}
                    listCheck={listSelect}
                    tradeZones={listTz}
                  />
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="button" variant="outlined" color="inherit" onClick={handleCloseModal}>
              {t('content.btnClose')}
            </Button>
            {/* <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              loadingIndicator="Loading..."
            >
              Add
            </LoadingButton> */}
          </DialogActions>
        </DialogAnimate>
      </Container>
    </Page>
  );
}
