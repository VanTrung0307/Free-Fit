import { Box, Container, Grid } from '@mui/material';
import mapApi from 'api/mapApi';
import tradeZoneApi from 'api/tradeZoneApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import SelectMUI from 'components/material-ui/SelectMUI';
import Page from 'components/Page';
import { LayerActive } from 'constants/layer';
import { storeActions } from 'features/store-management/storeSlice';
import { selectTzVersionOptions } from 'features/trade-zone-version/tzVersionSlice';
import useSettings from 'hooks/useSettings';
import { GeoJSONMarker, PostTradeZone, RequestBounds, TradeZone } from 'models';
import { Feature } from 'models/dto/groupZone';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import MapEditTradeZone from '../components/MapEditTradeZone';
import TradeZoneForm from '../components/TradeZoneForm';
import { selectFilter, tradeZoneActions } from '../tradeZoneSlice';

export default function AddEditTradeZonePage() {
  const { tradeZoneId } = useParams();
  const { storeId } = useParams();
  const isEdit = Boolean(tradeZoneId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [tradeZone, setTradeZone] = useState<TradeZone>();
  // for update
  const [tradeZonePost, setTradeZonePost] = useState<PostTradeZone>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [selectMode, setSelectMode] = useState(1);
  const [tzVersion, setTzVersion] = useState(-1);
  const tzVersionOptions = useAppSelector(selectTzVersionOptions);
  const [poisLayer, setPoisLayer] = useState<GeoJSONMarker>();
  const [myStoreLayer, setMyStoreLayer] = useState<GeoJSONMarker>();
  const [storesLayer, setStoreLayer] = useState<GeoJSONMarker>();
  const [listSelected, setListSelected] = useState<number[]>([]);
  const [listPost, setListPost] = useState<number[]>([]);
  const filter = useAppSelector(selectFilter);

  useEffect(() => {
    if (!tradeZoneId || !storeId) return;

    // IFFE
    (async () => {
      try {
        const data: TradeZone = await tradeZoneApi.getById(Number(storeId), Number(tradeZoneId));
        setTzVersion(data.tradeZoneVersionId || 0);
        const newValue: PostTradeZone = {
          groupZoneId: data.groupZoneId,
          listZoneId: [],
          name: data.name,
          storeId: data.storeId,
          stores: [{ id: data.storeId, name: data.storeName }],
          tradeZoneVersionId: data.tradeZoneVersionId,
          type: 0,
        };
        setTradeZonePost(newValue);
        setTradeZone(data);
        dispatch(
          tradeZoneActions.fetchFreeZoneList({
            type: selectMode,
            tzVersionId: data.tradeZoneVersionId,
            tzId: Number(tradeZoneId) || 0,
          })
        );
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeZoneId]);
  useEffect(() => {
    dispatch(storeActions.fetchStores({}));
  }, [dispatch]);
  const handelStoreFormSubmit = async (formValues: PostTradeZone) => {
    if (!isEdit) {
      try {
        if (formValues.listZoneId.length === 0) {
          enqueueSnackbar(t('tz.errorZoneTz'), { variant: 'warning' });
          return;
        }
        formValues.tradeZoneVersionId = tzVersion;
        formValues.type = selectMode;
        await tradeZoneApi.add(formValues).catch((err) => {
          if (err.response.status === 409) {
            enqueueSnackbar(t('tz.invalidZone'), { variant: 'error' });
          }
          throw err;
        });
        enqueueSnackbar(`${formValues?.name} ${t('tz.addSuccess')}`, { variant: 'success' });
        const newFilter = { ...filter };
        dispatch(tradeZoneActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.tradeZone.tradeZones);
      } catch (e) {
        enqueueSnackbar(`${formValues?.name} ${t('common.errorText')}`, { variant: 'error' });
      }
    } else {
      try {
        if (formValues.listZoneId.length === 0) {
          enqueueSnackbar(t('tz.errorZoneTz'), { variant: 'warning' });
          return;
        }
        formValues.tradeZoneVersionId = tzVersion;
        formValues.type = selectMode;
        await tradeZoneApi.update(Number(storeId), Number(tradeZoneId), formValues).catch((err) => {
          if (err.response.status === 409) {
            enqueueSnackbar(t('tz.invalidZone'), { variant: 'error' });
          }
          throw err;
        });
        enqueueSnackbar(`Trade zone: ${formValues.name} ${t('asset.updateSuccessEnd')}`, {
          variant: 'success',
        });
        const newFilter = { ...filter };
        dispatch(tradeZoneActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.tradeZone.tradeZones);
      } catch (error) {
        enqueueSnackbar(`${formValues?.name} ${t('common.errorText')}`, { variant: 'error' });
      }
    }
  };
  const initialValues: PostTradeZone = {
    name: '',
    groupZoneId: 0,
    tradeZoneVersionId: 0,
    stores: [],
    ...tradeZonePost,
  } as PostTradeZone;
  const freeWardOptions = [
    { id: 1, name: t('groupZone.ward') },
    { id: 2, name: t('groupZone.district') },
    { id: 0, name: t('common.systemZone') },
  ];
  // map
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
  const handelSelectFreeZone = (select: Feature) => {
    listSelected.push(select.properties.f3);
    setListSelected((old) => [...old]);
    const newList = [...listSelected];
    setListPost(newList);
  };
  const handelRemoveFreeZone = (select: Feature) => {
    listSelected.splice(
      listSelected.findIndex((item) => item === select.properties.f3),
      1
    );
    setListSelected((old) => [...old]);
    const newList = [...listSelected];

    setListPost(newList);
  };
  const handelTzVersionChange = (value) => {
    dispatch(
      tradeZoneActions.fetchFreeZoneList({
        type: selectMode,
        tzVersionId: value,
        tzId: Number(tradeZoneId) || 0,
      })
    );
    dispatch(storeActions.fetchStoresEmptyTz(value));
    setTzVersion(value);
  };
  const handelModeChange = (value) => {
    if (tzVersion !== -1) {
      dispatch(
        tradeZoneActions.fetchFreeZoneList({
          type: value,
          tzVersionId: tzVersion,
          tzId: Number(tradeZoneId) || 0,
        })
      );
    }
    setSelectMode(value);
  };
  return (
    <Page title={isEdit ? t('tz.editTitleTz') : t('tz.addTitleTz')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isEdit ? t('tz.editTitleTz') : t('tz.addTitleTz')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('tz.tzList'), href: PATH_DASHBOARD.tradeZone.tradeZones },
            {
              name: isEdit ? tradeZone?.name || '' : t('tz.addTitleTz'),
            },
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              {(!isEdit || Boolean(tradeZone)) && (
                <TradeZoneForm
                  initialValue={initialValues}
                  onSubmit={handelStoreFormSubmit}
                  isEdit={isEdit}
                  listPost={listPost}
                />
              )}
            </Grid>
            <Grid item xs={12} md={8}>
              <Box
                style={{
                  display: 'flex',
                  flexFlow: 'column nowrap',
                }}
              >
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={6}>
                      <SelectMUI
                        isAll={true}
                        label={t('tz.tzVerName')}
                        labelId="filterByTz"
                        options={tzVersionOptions}
                        onChange={handelTzVersionChange}
                        selected={tzVersion === -1 ? '' : tzVersion}
                        disabled={isEdit}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <SelectMUI
                        isAll={false}
                        label={t('groupZone.mode')}
                        labelId="filterByMode"
                        options={freeWardOptions}
                        onChange={handelModeChange}
                        selected={selectMode}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box mt={2}>
                  <MapEditTradeZone
                    onChangeBounds={handelOnChangeBounds}
                    stores={storesLayer || undefined}
                    myStore={myStoreLayer || undefined}
                    pois={poisLayer || undefined}
                    onActiveLayer={handelLayerActive}
                    onCloseLayer={handelRemoveLayer}
                    listSelected={listSelected}
                    onFreeZoneClick={handelSelectFreeZone}
                    onFreeZoneRemove={handelRemoveFreeZone}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
