import editFill from '@iconify/icons-eva/edit-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { Icon } from '@iconify/react';
// material
import {
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
// material
import { Box } from '@mui/system';
import groupZoneApi from 'api/groupZoneApi';
import mapApi from 'api/mapApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useTableNotPaging } from 'components/common/useTableNotPaging';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
import { LayerActive } from 'constants/layer';
// hooks
import useSettings from 'hooks/useSettings';
import 'leaflet/dist/leaflet.css';
import { GeoJSONMarker, RequestBounds } from 'models';
import { Feature } from 'models/dto/groupZone';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import GroupZoneMap from '../components/GroupZoneMap';
import { groupZoneActions, selectGroupZoneList, selectLoading } from '../groupZoneSlice';

// ----------------------------------------------------------------------

export default function GroupZoneList() {
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const rs = useAppSelector(selectGroupZoneList);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [groupZoneSelected, setGroupZoneSelected] = useState<Feature>();
  const [poisLayer, setPoisLayer] = useState<GeoJSONMarker>();
  const [myStoreLayer, setMyStoreLayer] = useState<GeoJSONMarker>();
  const [storesLayer, setStoreLayer] = useState<GeoJSONMarker>();
  // effect
  useEffect(() => {
    dispatch(groupZoneActions.fetchGroupZoneList());
  }, [dispatch]);
  // header
  const { t } = useTranslation();

  const headCells = [
    { id: 'id', label: '#', disableSorting: true },
    { id: 'name', label: t('groupZone.name') },
    { id: 'action', label: t('common.actions'), disableSorting: true, align: 'center' },
  ];

  const { TblHead } = useTableNotPaging({
    headCells,
  });
  const handelDetailsClick = (feature: Feature) => {
    setGroupZoneSelected(feature);
    setPopupOpen(true);
  };
  const handelRemoveClick = (feature: Feature) => {
    setGroupZoneSelected(feature);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    try {
      await groupZoneApi.remove(groupZoneSelected?.properties.f4.toString() as string);
      dispatch(groupZoneActions.fetchGroupZoneList());
      enqueueSnackbar(
        `Group zone: ${groupZoneSelected?.properties.f1} ${t('store.deleteSuccess')}`,
        {
          variant: 'success',
        }
      );
      setGroupZoneSelected(undefined);
      setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(t('common.errorText'), { variant: 'error' });
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
  return (
    <Page title={t('groupZone.title')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('groupZone.list')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('groupZone.list') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.groupZone.add}
              startIcon={<Icon icon={plusFill} />}
            >
              {t('groupZone.add')}
            </Button>
          }
        />

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table size="small">
                <TblHead />
                <TableBody>
                  {true && (
                    <TableRow style={{ height: 1 }}>
                      <TableCell colSpan={20} style={{ paddingBottom: '0px', paddingTop: '0px' }}>
                        <Box>{loading && <LinearProgress color="primary" />}</Box>
                      </TableCell>
                    </TableRow>
                  )}

                  {rs.features?.map((e, idx) => (
                    <TableRow key={e.properties.f4}>
                      <TableCell width={70} align="left">
                        {idx + 1}
                      </TableCell>
                      <TableCell align="left">{e.properties.f1}</TableCell>
                      <TableCell width={300}>
                        {/* <Box style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button
                            color="info"
                            onClick={() => handelDetailsClick(e)}
                            startIcon={<Icon icon={editFill} />}
                          >
                            {t('groupZone.viewOnMap')}
                          </Button>
                          <Button
                            color="error"
                            onClick={() => handelRemoveClick(e)}
                            startIcon={<Icon icon={trash2Outline} />}
                          >
                            {t('common.remove')}
                          </Button>
                        </Box> */}
                        <Box style={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip
                            key={`btnDetails-${e.properties.f4}`}
                            title={t('groupZone.viewOnMap') || ''}
                          >
                            <IconButton
                              color="info"
                              onClick={() => handelDetailsClick(e)}
                              size="large"
                            >
                              <Icon icon={editFill} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            key={`btnDelete-${e.properties.f4}`}
                            title={t('common.remove') || ''}
                          >
                            <span>
                              <IconButton
                                color="error"
                                onClick={() => handelRemoveClick(e)}
                                size="large"
                              >
                                <Icon icon={trash2Outline} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {rs.features?.length === 0 && (
                    <TableRow style={{ height: 53 * 10 }}>
                      <TableCell colSpan={20}>
                        <Typography gutterBottom align="center" variant="subtitle1">
                          {t('common.notFound')}
                        </Typography>
                        <Typography variant="body2" align="center">
                          {t('common.searchNotFound')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>{t('common.titleConfirm')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Group zone: ${groupZoneSelected?.properties.f1} ${t('store.removeTitleEnd')}`}
            <br />
            {t('common.canRevert')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setConfirmDelete(false)}>
            {t('content.btnClose')}
          </Button>
          <Button onClick={handelConfirmRemoveClick} autoFocus>
            {t('common.confirmBtn')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={popupOpen} onClose={() => setPopupOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{t('common.details')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <GroupZoneMap
              onChangeBounds={handelOnChangeBounds}
              stores={storesLayer || undefined}
              myStore={myStoreLayer || undefined}
              pois={poisLayer || undefined}
              onActiveLayer={handelLayerActive}
              onCloseLayer={handelRemoveLayer}
              selectedGroupZoneId={groupZoneSelected?.properties.f4}
              centerGzSelected={groupZoneSelected?.properties.f2}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setPopupOpen(false)}>
            {t('content.btnClose')}
          </Button>
          <Button
            onClick={() => {
              navigate(`${PATH_DASHBOARD.groupZone.edit}/${groupZoneSelected?.properties.f4}`);
            }}
            autoFocus
          >
            {t('common.editInfo')}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
