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
import brandApi from 'api/brandApi';
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
import { Store, Brand } from 'models';
import { AttrResponse } from 'models/dto/attrResponse';
import QRCode from 'qrcode.react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { brandActions } from '../brandSlice';
import './style.css';

interface BrandViewPageProps {}
const style = {
  display: 'flex',
  alignItems: 'left',
  justifyContent: 'left',
  flexWrap: 'wrap',
  padding: '0px',
  '& > *': { mx: '8px !important' },
} as const;
export default function BrandViewPage(props: BrandViewPageProps) {
  const { brandId } = useParams();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [brand, setBrand] = useState<Brand>();
  const [value, setValue] = useState('1');
  const [isErrorImage, setIsErrorImage] = useState<boolean>(false);
  useEffect(() => {
    dispatch(brandActions.fetchSegmentType());
  }, [dispatch]);
  useEffect(() => {
    if (!brandId) return;

    // IFFE
    (async () => {
      try {
        const data: Brand = await brandApi.getBrandById(brandId);
        setBrand(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [brandId]);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Page title={t('brand.detailsBrand')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('brand.detailsBrand')}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: t('brand.title'), href: PATH_DASHBOARD.brand.root },
            { name: brand?.name || '' },
          ]}
        />
        <Box>
          <CardHeader
            title={t('brand.info')}
            action={
              <Button
                component={RouterLink}
                to={`${PATH_DASHBOARD.brand.editInfo}/${brand?.id}`}
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
              <Grid item xs={12} md={3} lg={3}>
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
                        src={brand?.imageUrl}
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
              </Grid>
              <Grid item xs={12} md={9} lg={9}>
                {Boolean(brand) && (
                  <>
                    <TypographyDetails title={t('brand.brandName')} content={brand?.name} />
                    <TypographyDetails title={t('brand.icon')} content={brand?.iconUrl} />
                    <TypographyDetails title={t('brand.img')} content={brand?.imageUrl} />
                    <TypographyDetails
                      title={t('brand.segmentTypeName')}
                      content={brand?.segmentName}
                    />
                  </>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Page>
  );
}
