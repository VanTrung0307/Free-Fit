import cloudDownloadFill from '@iconify/icons-eva/cloud-download-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  CardHeader,
  Container,
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Paper,
  Stack,
  Tab,
  Typography,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import storeApi from 'api/storeApi';
import { useAppDispatch } from 'app/hooks';
import MapWithMarker from 'components/common/MapWithMarker';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { IconMyStore } from 'components/map/MarkerStyles';
import Page from 'components/Page';
import TypographyDetails from 'components/TypographyDetails';
import Images from 'constants/image';
import useSettings from 'hooks/useSettings';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Store } from 'models';
import { AttrResponse } from 'models/dto/attrResponse';
import QRCode from 'qrcode.react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import AttrView from '../components/AttrView';
import { Block } from '../components/Block';
import { storeActions } from '../storeSlice';
import './style.css';

interface StoreViewPageProps {}
const style = {
  display: 'flex',
  alignItems: 'left',
  justifyContent: 'left',
  flexWrap: 'wrap',
  padding: '0px',
  '& > *': { mx: '8px !important' },
} as const;
export default function CustomerViewPage(props: StoreViewPageProps) {
  const { storeId } = useParams();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [store, setStore] = useState<Store>();
  const [location, setLocation] = useState<LatLngExpression>();
  const [attrs, setAttrs] = useState<AttrResponse[]>();
  const [value, setValue] = useState('1');
  const [isErrorImage, setIsErrorImage] = useState<boolean>(false);
  useEffect(() => {
    dispatch(storeActions.fetchStoreType());
  }, [dispatch]);
  useEffect(() => {
    if (!storeId) return;

    // IFFE
    (async () => {
      try {
        const data: Store = await storeApi.getStoreById(storeId);
        if (data?.geom?.coordinates) {
          const detailsLocation: LatLngExpression = [
            data?.geom?.coordinates[1],
            data?.geom?.coordinates[0],
          ];
          setLocation(detailsLocation);
        }
        setStore(data);
        if (data.storeTypeId) {
          const attrData: AttrResponse[] = await storeApi.getAttrField(
            storeId,
            data.storeTypeId.toString()
          );
          setAttrs(attrData);
        }
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, [storeId]);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
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
  return (
    <Page title={'Chi tiết Khách hàng'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Chi tiết Khách hàng'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Quản lí Khách hàng', href: PATH_DASHBOARD.customer.root },
            { name: store?.name || '' },
          ]}
        />
        <Box>
          <CardHeader
            title={'Thông tin Khách hàng'}
            action={
              <Button
                component={RouterLink}
                to={`${PATH_DASHBOARD.customer.editInfo}/${store?.id}`}
                startIcon={<Icon icon={editFill} />}
              >
                {t('common.editInfo')}
              </Button>
            }
            style={{ marginBottom: '16px' }}
          />
          <Paper
            sx={{
              p: 3,
              width: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <Grid container spacing={2}>
              {/* <Grid item xs={12} md={3} lg={3}>
                <ImageList rowHeight={180} style={{ height: '300px' }}>
                  <ImageListItem key="no-evidence" cols={2} style={{ height: '100%' }}>
                    <Box
                      style={{ width: '100%', height: '100%' }}
                      sx={{ position: 'relative', pt: 'calc(100% / 16 * 9)' }}
                    >
                      <Box
                        component="img"
                        alt="error"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = Images.ERROR_IMG;
                          setIsErrorImage(true);
                        }}
                        src={store?.imageUrl}
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
                      title={t('store.imageUrl')}
                      subtitle={isErrorImage ? <span>{t('common.errorImage')}</span> : ''}
                      style={{ borderRadius: '5px' }}
                    />
                  </ImageListItem>
                </ImageList>
              </Grid> */}
              <Grid item xs={12} md={9} lg={9}>
                {Boolean(store) && (
                  <>
                    <TypographyDetails title={t('brand.brand')} content={store?.brandName} />
                    <TypographyDetails title={t('store.storeCode')} content={store?.storeCode} />
                    <TypographyDetails title={t('store.storeName')} content={store?.name} />
                    <TypographyDetails title={t('store.phone')} content={store?.phone} />
                    <TypographyDetails title={t('store.bank')} content={store?.bank} />
                    <TypographyDetails title={t('store.location')} content={store?.wkt} />
                    <TypographyDetails title={t('store.img')} content={store?.imageUrl} />
                    <TypographyDetails
                      title={t('store.storeTypeName')}
                      content={store?.storeTypeName}
                    />
                    <TypographyDetails title={t('store.address')} content={store?.address} />
                    <TypographyDetails title={t('store.building')} content={store?.buildingName} />
                  </>
                )}
              </Grid>
            </Grid>
          </Paper>
          {/* <CardHeader title={t('store.addressMap')} style={{ marginBottom: '16px' }} />
          <Paper
            sx={{
              p: 1,
              width: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <Stack spacing={2}>
              <Box>
                <Box mt={0}>
                  <MapWithMarker position={location} icon={IconMyStore} />
                </Box>
              </Box>
            </Stack>
          </Paper> */}
          <CardHeader
            title={t('store.attrs')}
            action={
              <Button
                component={RouterLink}
                to={`${PATH_DASHBOARD.store.editAttrs}/${store?.id}/${store?.storeTypeId}`}
                startIcon={<Icon icon={editFill} />}
              >
                {t('common.editInfo')}
              </Button>
            }
            style={{ marginBottom: '16px' }}
          />
          <Paper
            sx={{
              pt: 1,
              pr: 3,
              pl: 3,
              pb: 3,
              width: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <Block sx={style}>
              <TabContext value={value}>
                <TabList onChange={handleChange}>
                  {attrs?.map((tab, index) => (
                    <Tab key={tab.id} label={tab.name} value={String(index + 1)} />
                  ))}
                </TabList>
                <Box
                  sx={{
                    mt: 2,

                    width: '100%',
                    borderRadius: 1,
                  }}
                >
                  {attrs?.map((panel, index) => (
                    <TabPanel key={panel.id} value={String(index + 1)} style={{ padding: '0px' }}>
                      <AttrView initialValue={panel.attrs} id={panel.id} />
                    </TabPanel>
                  ))}
                </Box>
              </TabContext>
            </Block>
          </Paper>
          <CardHeader
            title={t('content.templates')}
            action={
              <>
                {store?.template && (
                  <Button
                    onClick={downloadQR}
                    color="info"
                    startIcon={<Icon icon={cloudDownloadFill} color="#1890FF" />}
                  >
                    {t('content.btnDownloadQR')}
                  </Button>
                )}
                <Button
                  component={RouterLink}
                  to={`${PATH_DASHBOARD.store.editTemplates}/${store?.id}/true`}
                  startIcon={<Icon icon={editFill} />}
                >
                  {t('common.editInfo')}
                </Button>
              </>
            }
            style={{ marginBottom: '16px' }}
          />
          <Paper
            sx={{
              p: 3,
              width: 1,
              bgcolor: 'background.neutral',
            }}
          >
            {store?.template ? (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={6}>
                  <ImageList rowHeight={180} style={{ height: '600px' }}>
                    <ImageListItem key="no-evidence" cols={2} style={{ height: '100%' }}>
                      <Box
                        style={{ width: '100%', height: '100%' }}
                        sx={{ position: 'relative', pt: 'calc(100% / 16 * 9)' }}
                      >
                        <Box
                          component="img"
                          alt="error"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = Images.ERROR_IMG;
                            setIsErrorImage(true);
                          }}
                          src={store?.template.imageUrl}
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
                        title={
                          <Typography variant="h5" gutterBottom>
                            {t('store.infoTemplate')}
                          </Typography>
                        }
                        subtitle={
                          <Paper
                            sx={{
                              p: 3,
                              width: 1,
                              bgcolor: 'background.neutral',
                            }}
                          >
                            <TypographyDetails
                              title={t('store.templateId')}
                              content={store?.template.id.toString()}
                            />
                            <TypographyDetails
                              title={t('store.templateName')}
                              content={store?.template.name}
                            />
                            <TypographyDetails title={t('store.url')} content={store?.url} />
                          </Paper>
                        }
                        style={{ borderRadius: '5px' }}
                      />
                    </ImageListItem>
                  </ImageList>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <ImageList rowHeight={180} style={{ height: '600px' }}>
                    <ImageListItem key="no-evidence" cols={2} style={{ height: '100%' }}>
                      <Box
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                        // sx={{ position: 'relative', pt: 'calc(100% / 16 * 9)' }}
                      >
                        <QRCode
                          id="qrcode"
                          value={store.url}
                          size={600}
                          level="H"
                          includeMargin={true}
                        />
                      </Box>

                      <ImageListItemBar title="QR Code" style={{ borderRadius: '5px' }} />
                    </ImageListItem>
                  </ImageList>
                </Grid>
              </Grid>
            ) : (
              <Box textAlign="center">{t('store.noteTemplate')}</Box>
            )}
          </Paper>
        </Box>
      </Container>
    </Page>
  );
}
