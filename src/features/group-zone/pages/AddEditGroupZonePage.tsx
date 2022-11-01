import { Autocomplete, Box, Container, Grid, LinearProgress, TextField } from '@mui/material';
import groupZoneApi from 'api/groupZoneApi';
import mapApi from 'api/mapApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import MultiCheckView from 'components/common/MultiCheckView';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import SelectMUI from 'components/material-ui/SelectMUI';
import Page from 'components/Page';
import { LayerActive } from 'constants/layer';
import useSettings from 'hooks/useSettings';
import { GeoJSONMarker, RequestBounds } from 'models';
import { Feature, GroupZoneDetails, PostGroupZone } from 'models/dto/groupZone';
import { OptionsTimeFilter } from 'models/dto/timeFilter';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import AddGroupZoneMap from '../components/AddGroupZoneMap';
import GroupZoneForm from '../components/GroupZoneForm';
import GroupZoneMap from '../components/GroupZoneMap';
import {
  groupZoneActions,
  selectFreeZoneOptions,
  selectGroupZoneList,
  selectLoading,
} from '../groupZoneSlice';

export default function AddEditGroupZonePage() {
  const { groupZoneId } = useParams();
  const isEdit = Boolean(groupZoneId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [groupZone, setGroupZone] = useState<GroupZoneDetails>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const rs = useAppSelector(selectGroupZoneList);
  const [poisLayer, setPoisLayer] = useState<GeoJSONMarker>();
  const [myStoreLayer, setMyStoreLayer] = useState<GeoJSONMarker>();
  const [storesLayer, setStoreLayer] = useState<GeoJSONMarker>();
  const [listSelected, setListSelected] = useState<number[]>([]);
  const [listPost, setListPost] = useState<number[]>([]);
  const fzOptions = useAppSelector(selectFreeZoneOptions);
  const selectedBox = fzOptions.filter(({ id }) => listPost.includes(id));
  // dateFilterOptions.filter(({ id }) => dateSelected.includes(id));

  const loading = useAppSelector(selectLoading);
  const freeWardOptions = [
    { id: 1, name: t('groupZone.ward') },
    { id: 2, name: t('groupZone.district') },
  ];
  const [selectMode, setSelectMode] = useState(2);
  useEffect(() => {
    if (!groupZoneId) return;

    // IFFE
    (async () => {
      try {
        const data: GroupZoneDetails = await groupZoneApi.getById(groupZoneId);
        setGroupZone(data);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, [groupZoneId]);
  useEffect(() => {
    dispatch(groupZoneActions.fetchFreeZoneList(selectMode));
  }, [dispatch, selectMode]);

  const initialValues: GroupZoneDetails = {
    id: '',
    brandId: '',
    geom: '',
    name: '',
    ...groupZone,
  } as GroupZoneDetails;

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
  const handelStoreFormSubmit = async (formValues: PostGroupZone) => {
    if (!isEdit) {
      try {
        if (listSelected.length === 0) {
          enqueueSnackbar(t('groupZone.errorSelected'), { variant: 'error' });
          return;
        }
        formValues.listZoneId = [...listPost];
        formValues.type = selectMode;

        const result: boolean = await mapApi.checkValidGroupZone(formValues);

        if (!result) {
          enqueueSnackbar(t('groupZone.invalidGroupZone'), { variant: 'error' });
          return;
        }
        await groupZoneApi.add(formValues);
        enqueueSnackbar(`${formValues?.name} ${t('groupZone.addSuccess')}`, { variant: 'success' });
        dispatch(groupZoneActions.fetchGroupZoneList());
        navigate(PATH_DASHBOARD.groupZone.root);
      } catch (error) {
        enqueueSnackbar(`${formValues?.name} ${t('common.errorText')}`, { variant: 'error' });
      }
    } else {
      try {
        formValues.type = selectMode;
        await groupZoneApi.update(groupZoneId || '', { name: formValues.name });
        enqueueSnackbar(`Group zone: ${formValues.name} ${t('asset.updateSuccessEnd')}`, {
          variant: 'success',
        });
        dispatch(groupZoneActions.fetchGroupZoneList());
        navigate(PATH_DASHBOARD.groupZone.root);
      } catch (error) {
        enqueueSnackbar(`${formValues?.name} ${t('common.errorText')}`, { variant: 'error' });
      }
    }
  };

  return (
    <Page title={isEdit ? t('groupZone.edit') : t('groupZone.add')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isEdit ? t('groupZone.edit') : t('groupZone.add')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('groupZone.list'), href: PATH_DASHBOARD.groupZone.root },
            {
              name: isEdit ? groupZone?.name || '' : t('groupZone.add'),
            },
          ]}
        />
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={6}>
                  <SelectMUI
                    isAll={false}
                    label={t('groupZone.mode')}
                    labelId="filterByMode"
                    options={freeWardOptions}
                    onChange={(value) => {
                      setSelectMode(value);
                    }}
                    selected={selectMode}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  {(!isEdit || Boolean(groupZone)) && (
                    <GroupZoneForm
                      initialValue={initialValues}
                      isEdit={isEdit}
                      onSubmit={handelStoreFormSubmit}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              {!isEdit && (
                // <Autocomplete
                //   fullWidth
                //   multiple
                //   limitTags={10}
                //   id="multiple-limit-tags"
                //   options={fzOptions}
                //   getOptionLabel={(option) => option.name}
                //   defaultValue={[]}
                //   value={selectedBox}
                //   renderInput={(params) => (
                //     <TextField {...params} variant="outlined" label={t('groupZone.selected')} />
                //   )}
                // />
                <>
                  <MultiCheckView
                    xs={3}
                    md={2}
                    lg={2}
                    options={fzOptions as OptionsTimeFilter[]}
                    value={selectedBox as OptionsTimeFilter[]}
                    isRow={true}
                    label={t('groupZone.selected')}
                    limit={10}
                  />
                </>
              )}
              <Box mt={2}>{loading && <LinearProgress color="primary" />}</Box>
              {isEdit ? (
                (!isEdit || Boolean(groupZone)) && (
                  <GroupZoneMap
                    onChangeBounds={handelOnChangeBounds}
                    stores={storesLayer || undefined}
                    myStore={myStoreLayer || undefined}
                    pois={poisLayer || undefined}
                    onActiveLayer={handelLayerActive}
                    onCloseLayer={handelRemoveLayer}
                    selectedGroupZoneId={groupZone?.id}
                    centerGzSelected={
                      rs?.features.find((x) => x.properties.f4 === groupZone?.id)?.properties.f2
                    }
                  />
                )
              ) : (
                <AddGroupZoneMap
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
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
