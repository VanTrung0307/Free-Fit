import editFill from '@iconify/icons-eva/edit-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import checkmarkCircle2Fill from '@iconify/icons-eva/checkmark-circle-2-fill';
import slashFill from '@iconify/icons-eva/slash-fill';
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
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useTableNotPaging } from 'components/common/useTableNotPaging';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Label from 'components/Label';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
import { groupZoneActions } from 'features/group-zone/groupZoneSlice';
// hooks
import useSettings from 'hooks/useSettings';
import { TzVersion, TzVersionRequest } from 'models';
import { GetConstantTimeFilter } from 'models/dto/timeFilter';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import { convertTimeFilter, parseDateFilterDisplay } from 'utils/common';
import tzVersionApi from 'api/tradeZoneVersionApi';
import TzVersionFilter from '../components/TzVersionFilter';
import {
  selectFilter,
  selectLoading,
  selectTzVersionList,
  tzVersionActions,
} from '../tzVersionSlice';

export default function TzVersionList() {
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const loading = useAppSelector(selectLoading);
  const rs = useAppSelector(selectTzVersionList);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tzVersionSelected, setTzVersionSelected] = useState<TzVersion>();
  const { dateFilter } = GetConstantTimeFilter();
  // const [popupOpen, setPopupOpen] = useState(false);
  const [activeBox, setActiveBox] = useState(false);
  const [unActiveBox, setUnActiveBox] = useState(false);

  // effect
  useEffect(() => {
    dispatch(tzVersionActions.fetchTzVersionList({ ...filter, storeId: 0 }));
  }, [dispatch, filter]);
  useEffect(() => {
    dispatch(groupZoneActions.fetchGroupZoneList());
  }, [dispatch]);
  // functions
  const handelFilterChange = (newFilter: TzVersionRequest) => {
    dispatch(tzVersionActions.setFilterWithDebounce(newFilter));
  };
  // header
  const { t } = useTranslation();

  const headCells = [
    { id: '#', label: '#', disableSorting: true },
    { id: 'name', label: t('tz.tzVerName'), disableSorting: true },
    { id: 'date', label: t('tz.dateFilter'), disableSorting: true },
    { id: 'time', label: t('tz.timeFilter'), disableSorting: true },
    { id: 'storeName', label: t('tz.storesApply'), disableSorting: true },
    { id: 'gz', label: t('groupZone.name'), disableSorting: true },
    { id: 'status', label: t('common.status'), disableSorting: true },
    { id: 'action', label: t('common.actions'), disableSorting: true, align: 'center' },
  ];
  const { TblHead } = useTableNotPaging({
    headCells,
  });
  const handelDetailsClick = (tzVersion: TzVersion) => {
    navigate(`${PATH_DASHBOARD.tradeZone.tzVersionDetails}/${tzVersion?.id}`);
    // setTzVersionSelected(tzVersion);
    // setPopupOpen(true);
  };
  const handelRemoveClick = (asset: TzVersion) => {
    setTzVersionSelected(asset);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    try {
      await tzVersionApi.remove(Number(tzVersionSelected?.id) || 0);
      const newFilter = { ...filter };
      dispatch(tzVersionActions.setFilter(newFilter));
      enqueueSnackbar(`${tzVersionSelected?.name} ${t('store.deleteSuccess')}`, {
        variant: 'success',
      });
      setTzVersionSelected(undefined);
      setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(`${tzVersionSelected?.name} ${t('common.errorText')}`, { variant: 'error' });
    }
  };
  const handelConfirmActive = (tzVersion: TzVersion) => {
    setTzVersionSelected(tzVersion);
    setActiveBox(true);
  };
  const handelConfirmUnActive = (tzVersion: TzVersion) => {
    setTzVersionSelected(tzVersion);
    setUnActiveBox(true);
  };
  const handelActiveClick = async () => {
    try {
      await tzVersionApi.active(tzVersionSelected?.id.toString() || '');
      const newFilter = { ...filter };
      dispatch(tzVersionActions.setFilter(newFilter));
      enqueueSnackbar(`${tzVersionSelected?.name} ${t('tz.activeSuccessEnd')}`, {
        variant: 'success',
      });
      setTzVersionSelected(undefined);
      setActiveBox(false);
    } catch (error) {
      enqueueSnackbar(
        `${t('tz.activeTitleStart') + tzVersionSelected?.name} ${t('common.errorText')}`,
        { variant: 'error' }
      );
    }
  };
  const handelUnActiveClick = async () => {
    try {
      await tzVersionApi.unActive(tzVersionSelected?.id.toString() || '');
      const newFilter = { ...filter };
      dispatch(tzVersionActions.setFilter(newFilter));
      enqueueSnackbar(
        `${t('tz.unActiveTitleStart') + tzVersionSelected?.name} ${t('tz.activeSuccessEnd')}`,
        {
          variant: 'success',
        }
      );
      setTzVersionSelected(undefined);
      setUnActiveBox(false);
    } catch (error) {
      enqueueSnackbar(`${tzVersionSelected?.name} ${t('common.errorText')}`, { variant: 'error' });
    }
  };

  return (
    <Page title={t('tz.tzVersion')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('tz.tzVersion')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('tz.tzVersion') },
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
          <TzVersionFilter filter={filter} onChange={handelFilterChange} />

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

                  {rs?.map((e, idx) => (
                    <TableRow key={e.id}>
                      <TableCell align="left">{idx + 1}</TableCell>
                      <TableCell align="left">{e.name}</TableCell>

                      <TableCell align="left" width={200}>
                        {parseDateFilterDisplay(e.dateFilter).map((f) => (
                          <Label key={`${f.start}`} color="info">
                            {f.end !== -1
                              ? `${dateFilter[f.start]}->${dateFilter[f.end]}`
                              : `${dateFilter[f.start]}`}
                          </Label>
                        ))}
                      </TableCell>
                      <TableCell align="left" width={200}>
                        {convertTimeFilter(e.timeSlot).map((f) => (
                          <Label key={`${f.start}`} color="warning">{`${f.start}->${f.end}`}</Label>
                        ))}
                      </TableCell>
                      <TableCell align="left">{e.storesName?.length}</TableCell>
                      <TableCell align="left">
                        {e.groupZoneName === '' ? t('store.none') : e.groupZoneName}
                      </TableCell>
                      <TableCell>
                        <Box color={e.isActive ? 'green' : 'red'} fontWeight="bold">
                          {e.isActive ? t('tz.active') : t('tz.unActive')}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box style={{ display: 'flex', justifyContent: 'center' }}>
                          {e.isActive ? (
                            <Tooltip key={`btnActive-${idx}`} title={t('tz.btnUnActive') || ''}>
                              <IconButton
                                color="warning"
                                onClick={() => handelConfirmUnActive(e)}
                                size="large"
                              >
                                <Icon icon={slashFill} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip key={`btnUnActive-${idx}`} title={t('tz.btnActive') || ''}>
                              <IconButton
                                color="success"
                                onClick={() => handelConfirmActive(e)}
                                size="large"
                              >
                                <Icon icon={checkmarkCircle2Fill} />
                              </IconButton>
                            </Tooltip>
                          )}

                          <Tooltip key={`btnDetails-${idx}`} title={t('common.details') || ''}>
                            <IconButton
                              color="info"
                              onClick={() => handelDetailsClick(e)}
                              size="large"
                            >
                              <Icon icon={editFill} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip key={`btnDelete-${idx}`} title={t('common.remove') || ''}>
                            <IconButton
                              color="error"
                              onClick={() => handelRemoveClick(e)}
                              size="large"
                            >
                              <Icon icon={trash2Outline} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {rs?.length === 0 && (
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
          <DialogContentText>
            {`Version: ${tzVersionSelected?.name} ${t('store.removeTitleEnd')}`}
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
      {/* <Dialog open={popupOpen} onClose={() => setPopupOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{t('common.details')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {Boolean(tzVersionSelected) && (
              <TzVersionViewEditForm
                initialValue={tzVersionSelected as TzVersion}
                isView={true}
                isEdit={false}
              />
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setPopupOpen(false)}>
            {t('content.btnClose')}
          </Button>
          {!tzVersionSelected?.isActive && (
            <Button
              onClick={() => {
                navigate(`${PATH_DASHBOARD.tradeZone.tzVersionEdit}/${tzVersionSelected?.id}`);
              }}
              autoFocus
            >
              {t('common.editInfo')}
            </Button>
          )}
        </DialogActions>
      </Dialog> */}
      <Dialog open={activeBox} onClose={() => setActiveBox(false)}>
        <DialogTitle>{t('common.titleConfirm')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('tz.activeTitleStart') + tzVersionSelected?.name}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setActiveBox(false)}>
            {t('content.btnClose')}
          </Button>
          <Button onClick={handelActiveClick} autoFocus>
            {t('tz.btnActive')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={unActiveBox} onClose={() => setUnActiveBox(false)}>
        <DialogTitle>{t('common.titleConfirm')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('tz.unActiveTitleStart') + tzVersionSelected?.name}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setUnActiveBox(false)}>
            {t('content.btnClose')}
          </Button>
          <Button onClick={handelUnActiveClick} autoFocus>
            {t('tz.btnUnActive')}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
