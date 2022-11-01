import qrcodeOutlined from '@iconify/icons-ant-design/qrcode-outlined';
import editFill from '@iconify/icons-eva/edit-fill';
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
import { useTable } from 'components/common';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
import { StoreFilter } from 'features/store-management/components/StoreFilter';
import {
  selectFilter,
  selectLoading,
  selectStoresResponse,
  storeActions,
} from 'features/store-management/storeSlice';
// hooks
import useSettings from 'hooks/useSettings';
import { GetStatusMap, PaginationRequest, Store } from 'models';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
// ----------------------------------------------------------------------

export default function Template() {
  const { themeStretch } = useSettings();
  const [showPopup, setShowPopup] = useState(false);
  const [storeSelected, setStoreSelected] = useState<Store>();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const rs = useAppSelector(selectStoresResponse);
  const loading = useAppSelector(selectLoading);
  const { statusMap } = GetStatusMap();
  const navigate = useNavigate();

  // effect
  useEffect(() => {
    dispatch(storeActions.fetchStores(filter));
  }, [dispatch, filter]);
  const downloadQR = () => {
    const canvas = document.getElementById('qrcode') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'test.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      // eslint-disable-next-line no-useless-return
    } else return;
  };
  const onPageChange = (page: number) => {
    dispatch(
      storeActions.setFilter({
        ...filter,
        page: page + 1,
      })
    );
  };
  const onRowPerPageChange = (perPage: number) => {
    dispatch(
      storeActions.setFilter({
        ...filter,
        pageSize: perPage,
      })
    );
  };
  const onSortChange = (colName: string, sortType: number) => {
    dispatch(
      storeActions.setFilter({
        ...filter,
        colName,
        sortType,
      })
    );
  };

  const handelShowPopupClick = (store: Store) => {
    setStoreSelected(store);
    setShowPopup(true);
  };

  // header
  const { t } = useTranslation();
  const headCells = [
    { id: 'no', label: '#' },
    { id: 'name', label: t('store.storeName') },
    { id: 'address', label: t('store.selectedTemplate') },
    { id: 'status', label: t('common.status') },
    { id: 'actions', label: t('common.actions'), disableSorting: true, align: 'center' },
  ];

  const { TblHead, TblPagination } = useTable({
    rs,
    headCells,
    filter,
    onPageChange,
    onRowPerPageChange,
    onSortChange,
  });
  const handelDetailsClick = (store: Store) => {
    navigate(`${PATH_DASHBOARD.template.edit}/${store.id}/false`);
  };
  const handelSearchDebounce = (newFilter: PaginationRequest) => {
    dispatch(storeActions.setFilterWithDebounce(newFilter));
  };
  return (
    <Page title={t('store.templatePage')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('store.listStore')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('store.listStore') },
          ]}
        />

        <Card>
          <StoreFilter filter={filter} onSearchChange={handelSearchDebounce} />
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

                  {rs.results.map((e, idx) => (
                    <TableRow key={e.id}>
                      <TableCell width={80} component="th" scope="row" padding="none">
                        {idx + 1}
                      </TableCell>
                      <TableCell align="left">{e.name}</TableCell>
                      <TableCell align="left">{e.template?.name || t('store.none')}</TableCell>
                      <TableCell>
                        <Box color={statusMap[e.status].color} fontWeight="bold">
                          {statusMap[e.status].name}
                        </Box>
                      </TableCell>
                      <TableCell width={300}>
                        {/* <Box style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button
                            disabled={!Boolean(e.template.name)}
                            color="info"
                            onClick={() => handelShowPopupClick(e)}
                            startIcon={<Icon icon={qrcodeOutlined} color="#1890FF" />}
                          >
                            {t('store.detailsQRCode')}
                          </Button>
                          <Button
                            color="success"
                            onClick={() => handelDetailsClick(e)}
                            startIcon={<Icon icon={editFill} color="#54D62C" />}
                          >
                            {t('common.editInfo')}
                          </Button>
                        </Box> */}
                        <Box style={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip key={`btnQrCode-${e.id}`} title={t('store.detailsQRCode') || ''}>
                            <span>
                              <IconButton
                                color="info"
                                onClick={() => handelShowPopupClick(e)}
                                disabled={!e.template.name}
                                size="large"
                              >
                                <Icon icon={qrcodeOutlined} />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip key={`btnDetails-${e.id}`} title={t('common.editInfo') || ''}>
                            <IconButton
                              color="info"
                              onClick={() => handelDetailsClick(e)}
                              size="large"
                            >
                              <Icon icon={editFill} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {rs.results.length === 0 && (
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

          <TblPagination />
        </Card>
      </Container>
      <Dialog open={showPopup} onClose={() => setShowPopup(false)} maxWidth="lg">
        <DialogTitle>QR CODE</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexFlow: 'row nowrap',
              }}
            >
              <QRCode
                id="qrcode"
                value={storeSelected?.url}
                size={300}
                level="H"
                includeMargin={true}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setShowPopup(false)}>
            {t('content.btnClose')}
          </Button>
          <Button onClick={downloadQR} autoFocus>
            {t('content.btnDownloadQR')}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
