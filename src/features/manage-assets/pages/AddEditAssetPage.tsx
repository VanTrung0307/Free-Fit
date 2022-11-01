import { Box, Card, Container, Grid } from '@mui/material';
import assetApi from 'api/assetApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import { poiBrandActions as assetActions, selectFilter } from 'features/pois-brand/poiBrandSlice';
import useSettings from 'hooks/useSettings';
import { Asset } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import AssetForm from '../components/AssetForm';

export default function AddEditAssetPage() {
  const { assetId } = useParams();
  const isEdit = Boolean(assetId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [asset, setAsset] = useState<Asset>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  useEffect(() => {
    if (!assetId) return;

    // IFFE
    (async () => {
      try {
        const data: Asset = await assetApi.getById(assetId);
        setAsset(data);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, [assetId]);
  const handelStoreFormSubmit = async (formValues: Asset) => {
    if (!isEdit) {
      try {
        await assetApi.add(formValues);
        enqueueSnackbar(`${formValues?.name} ${t('asset.addSuccess')}`, { variant: 'success' });
        const newFilter = { ...filter };
        dispatch(assetActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.asset.assets);
      } catch (error) {
        enqueueSnackbar(`${formValues?.name} ${t('common.errorText')}`, { variant: 'error' });
      }
    } else {
      try {
        await assetApi.update(assetId, formValues);
        enqueueSnackbar(
          `${t('asset.updateSuccessStart') + formValues.name} ${t('asset.updateSuccessEnd')}`,
          { variant: 'success' }
        );
        const newFilter = { ...filter };
        dispatch(assetActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.asset.assets);
      } catch (error) {
        enqueueSnackbar(`${formValues?.name} ${t('common.errorText')}`, { variant: 'error' });
      }
    }
  };
  const initialValues: Asset = {
    name: '',
    type: '',
    storeId: '',
    ...asset,
  } as Asset;
  return (
    <Page title={isEdit ? t('asset.editTitle') : t('asset.addTitle')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isEdit ? t('asset.editTitle') : t('asset.addTitle')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('asset.list'), href: PATH_DASHBOARD.asset.assets },
            {
              name: isEdit ? asset?.name || '' : t('asset.addTitle'),
            },
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              {(!isEdit || Boolean(asset)) && (
                <Card sx={{ p: 2 }}>
                  <AssetForm
                    initialValue={initialValues}
                    onSubmit={handelStoreFormSubmit}
                    isEdit={isEdit}
                    isView={false}
                  />
                </Card>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
