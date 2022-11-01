import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import brandApi from 'api/brandApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import { selectFilter } from 'features/pois-brand/poiBrandSlice';
import useSettings from 'hooks/useSettings';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PostStore, Store, Brand, PostBrand } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { getCurrentUser } from 'utils/common';
import BrandForm from '../components/BrandForm';
import { brandActions } from '../brandSlice';
import './style.css';

interface AddEditBrandPageProps {}

export default function AddEditBrandPage(props: AddEditBrandPageProps) {
  const { brandId } = useParams();
  const isEdit = Boolean(brandId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [brand, setBrand] = useState<PostBrand>();
  const [location, setLocation] = useState<LatLngExpression>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  const user = getCurrentUser();
  useEffect(() => {
    dispatch(brandActions.fetchSegmentType());
  }, [dispatch]);
  useEffect(() => {
    if (!brandId) return;

    // IFFE
    (async () => {
      try {
        const data: Brand = await brandApi.getBrandById(brandId);

        // let postLocation: string = '';
        // if (data?.geom?.coordinates) {
        //   const detailsLocation: LatLngExpression = [
        //     data?.geom?.coordinates[1],
        //     data?.geom?.coordinates[0],
        //   ];

        //   postLocation = `${data?.geom?.coordinates[0]} ${data?.geom?.coordinates[1]}`;
        //   setLocation(detailsLocation);
        // }
        const newValue: PostBrand = {
          name: data?.name || '',
          iconUrl: data?.iconUrl,
          imageUrl: data?.imageUrl || '',
          segmentId: data?.segmentId || 0,
        };

        setBrand(newValue);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, [brandId]);
  const handelBrandFormSubmit = async (formValues: PostBrand) => {
    if (!isEdit) {
      try {
        if (!user) return;
        await brandApi.add(formValues);
        enqueueSnackbar(`${formValues?.name} ${t('brand.addSuccess')}`, { variant: 'success' });
        const newFilter = { ...filter };
        dispatch(brandActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.brand.root);
      } catch (error) {
        enqueueSnackbar(
          `${formValues?.name} ${t('common.errorText')} ,${t('brand.brandCodeIsExisted')}`,
          { variant: 'error' }
        );
      }
    } else {
      try {
        if (!user) return;
        await brandApi.update(Number(brandId), formValues);
        enqueueSnackbar(
          `${t('brand.updateSuccessStart') + formValues.name} ${t('brand.updateSuccessEnd')}`,
          { variant: 'success' }
        );
        const newFilter = { ...filter };
        dispatch(brandActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.brand.root);
      } catch (error) {
        enqueueSnackbar(
          `${formValues?.name} ${t('common.errorText')} ,${t('brand.brandCodeIsExisted')}`,
          { variant: 'error' }
        );
      }
    }
  };
  const initialValues: PostBrand = {
    name: '',
    iconUrl: '',
    imageUrl: '',
    segmentId: 0,
    ...brand,
  } as PostBrand;

  const links = [
    { name: 'Dashboard', href: PATH_DASHBOARD.root },
    { name: t('brand.title'), href: PATH_DASHBOARD.brand.root },
    { name: !isEdit ? t('brand.btnAdd') : t('brand.editInfo') },
  ];
  if (isEdit) {
    links.push({
      name: brand?.name || '',
      href: `${PATH_DASHBOARD.brand.details}/${brandId}`,
    });
  }
  return (
    <Page title={!isEdit ? t('brand.formAdd') : t('brand.detailsBrand')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? t('brand.formAdd') : t('brand.detailsBrand')}
          links={links}
        />
        <Box>
          {(!isEdit || Boolean(brand)) && (
            <BrandForm
              initialValue={initialValues}
              onSubmit={handelBrandFormSubmit}
              isEdit={isEdit}
            />
          )}
        </Box>
      </Container>
    </Page>
  );
}
