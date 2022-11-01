import {
  Autocomplete,
  Box,
  Card,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import poiApi from 'api/poiApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import MapWithMarker from 'components/common/MapWithMarker';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { IconPois } from 'components/map/MarkerStyles';
import SelectMUI from 'components/material-ui/SelectMUI';
import Page from 'components/Page';
import {
  adminLevelActions,
  selectDistrictOptions,
  selectProvinceOptions,
  selectWardOptions,
} from 'features/admin-level/adminLevelSlice';
import { poiBrandActions, selectFilter } from 'features/pois-brand/poiBrandSlice';
import { poiActions, selectFilter as selectFilterPoi, selectPoiList } from 'features/pois/poiSlice';
import useSettings from 'hooks/useSettings';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Poi, PoiPagingRequest, PostPoiBrand } from 'models';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { getCurrentUser, splitWktToLatLng } from 'utils/common';
import PoiBrandForm from '../components/PoiBrandForm';
import './style.css';

export default function AddEditPoiBrandPage() {
  const { poiId } = useParams();
  const isEdit = Boolean(poiId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [poi, setPoi] = useState<Poi>();
  const [poiBrand, setPoiBrand] = useState<PostPoiBrand>();
  const [location, setLocation] = useState<LatLngExpression>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  const filterPoi = useAppSelector(selectFilterPoi);
  const [selectedPoiId, setSelectedPoiId] = useState();
  const user = getCurrentUser();
  const provinceOptions = useAppSelector(selectProvinceOptions);
  const districtOptions = useAppSelector(selectDistrictOptions);
  const wardOptions = useAppSelector(selectWardOptions);
  const poiList = useAppSelector(selectPoiList);
  useEffect(() => {
    if (!isEdit) {
      dispatch(poiActions.fetchPoiList(filterPoi));
    }
  }, [dispatch, filterPoi, isEdit]);
  useEffect(() => {
    if (!poiId) return;

    // IFFE
    (async () => {
      try {
        const data: Poi = await poiApi.getPoiBrandById(poiId);
        setPoi(data);

        if (data?.geom) {
          const latLng = splitWktToLatLng(data.geom);
          setLocation(latLng);
        }
        const newValue: PostPoiBrand = {
          alias: data.alias,
          brandId: data.brandId,
          brandPoiCode: data.brandPoiCode,
          notes: data.notes,
          poiId: data.id,
        };
        setPoiBrand(newValue);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, [poiId]);
  const handelStoreFormSubmit = async (formValues: PostPoiBrand) => {
    if (!isEdit) {
      try {
        if (!user) return;
        if (!selectedPoiId) {
          enqueueSnackbar(t('poi.errorPoiId'), { variant: 'warning' });
          return;
        }
        formValues.poiId = selectedPoiId || 0;
        await poiApi.addPoiBrand(formValues);
        enqueueSnackbar(`${formValues?.alias} ${t('poi.addSuccess')}`, { variant: 'success' });
        const newFilter = { ...filter };
        dispatch(poiBrandActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.poiBrand.root);
      } catch (error) {
        enqueueSnackbar(
          `${formValues?.alias} ${t('common.errorText')} ,${t('poi.errorBrandPoiExisted')}`,
          { variant: 'error' }
        );
      }
    } else {
      try {
        if (!user) return;
        await poiApi.updatePoiBrand(formValues);
        enqueueSnackbar(
          `${t('poi.updateSuccessStart') + formValues.alias} ${t('poi.updateSuccessEnd')}`,
          { variant: 'success' }
        );
        const newFilter = { ...filter };
        dispatch(poiBrandActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.poiBrand.root);
      } catch (error) {
        enqueueSnackbar(
          `${formValues?.alias} ${t('common.errorText')} ,${t('poi.errorBrandPoiExisted')}`,
          { variant: 'error' }
        );
      }
    }
  };
  const initialValues: PostPoiBrand = {
    brandId: user?.brandId,
    poiId: 0,
    alias: '',
    brandPoiCode: '',
    createBy: user?.id,
    notes: '',
    ...poiBrand,
  } as PostPoiBrand;
  const handelSelectLocation = (e, value) => {
    const rs = splitWktToLatLng(value.geom);
    setLocation(rs);
    setSelectedPoiId(value.id);
  };
  const handleProvinceChange = (selectedId: number) => {
    dispatch(adminLevelActions.provinceChange(selectedId));
    const newFilter: PoiPagingRequest = {
      ...filterPoi,
      provinceId: selectedId,
      page: 1,
      pageSize: 200,
    };
    dispatch(poiActions.setFilterWithDebounce(newFilter));
  };
  const handleDistrictChange = (selectedId: number) => {
    dispatch(adminLevelActions.districtChange(selectedId));
    const newFilter: PoiPagingRequest = {
      ...filterPoi,
      districtId: selectedId,
      page: 1,
      pageSize: 200,
    };
    dispatch(poiActions.setFilterWithDebounce(newFilter));
  };
  const handelWardChange = (selectedId: number) => {
    const newFilter: PoiPagingRequest = {
      ...filterPoi,
      wardId: selectedId,
      page: 1,
      pageSize: 200,
    };
    dispatch(poiActions.setFilterWithDebounce(newFilter));
  };
  return (
    <Page title={isEdit ? t('poi.editPoiBrandTitle') : t('poi.addPoiBrandTitle')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isEdit ? t('poi.editPoiBrandTitle') : t('poi.addPoiBrandTitle')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('poi.poiBrandList'), href: PATH_DASHBOARD.poiBrand.root },
            {
              name: isEdit ? poiBrand?.alias || '' : t('poi.addPoiBrandTitle'),
            },
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {(!isEdit || Boolean(poiBrand)) && (
                <PoiBrandForm
                  initialValue={initialValues}
                  onSubmit={handelStoreFormSubmit}
                  isEdit={isEdit}
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom marginBottom={2}>
                  {t('poi.sPoi')}
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    {!isEdit ? (
                      <>
                        <Box
                          style={{
                            display: 'flex',
                            flexFlow: 'row nowrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <SelectMUI
                            isAll={true}
                            label={t('adminLevel.province')}
                            labelId="filterByProvince"
                            options={provinceOptions}
                            onChange={handleProvinceChange}
                            selected={filterPoi.provinceId}
                          />
                          <SelectMUI
                            isAll={true}
                            label={t('adminLevel.district')}
                            labelId="filterByDistrict"
                            options={districtOptions}
                            onChange={handleDistrictChange}
                            selected={filterPoi.districtId}
                          />
                          <SelectMUI
                            isAll={true}
                            label={t('adminLevel.ward')}
                            labelId="filterByWard"
                            onChange={handelWardChange}
                            selected={filterPoi.wardId}
                            options={wardOptions}
                          />
                        </Box>
                        <Box mt={1}>
                          <Autocomplete
                            options={poiList.results}
                            getOptionLabel={(option) => option.name}
                            fullWidth
                            onChange={handelSelectLocation}
                            renderInput={(params) => (
                              <TextField {...params} label={t('poi.poi')} variant="outlined" />
                            )}
                          />
                        </Box>
                      </>
                    ) : (
                      <Box>
                        <TextField
                          fullWidth
                          label={t('poi.poiName')}
                          variant="outlined"
                          value={poi?.name || ''}
                          // defaultValue="value"
                          disabled
                          focused
                        />
                      </Box>
                    )}
                    <Box mt={2}>
                      <MapWithMarker position={location} icon={IconPois} />
                    </Box>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
