// material
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import storeApi from 'api/storeApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
// hooks
import useSettings from 'hooks/useSettings';
import { PostTemplate, Store, Template } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import ShopProductList from '../components/ShopProductList';
import TemplateForm from '../components/TemplateForm';
import { selectFilterTemplate, selectLoading, selectTemplate, storeActions } from '../storeSlice';
// ----------------------------------------------------------------------
const ProductImgStyle = styled('img')(({ theme }) => ({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
}));

export default function StoreTemplatePage() {
  const { themeStretch } = useSettings();
  const { storeId, isStoreView } = useParams();
  const [store, setStore] = useState<Store>();
  const [templateForm, setTemplateForm] = useState<PostTemplate>();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilterTemplate);
  const rs = useAppSelector(selectTemplate);
  const loading = useAppSelector(selectLoading);
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);
  const [selected, setSelected] = useState<Template>();
  const [selectTemplateId, setSelectTemplateId] = useState<Template>();
  const { enqueueSnackbar } = useSnackbar();

  // effect
  useEffect(() => {
    if (!storeId) return;

    // IFFE
    (async () => {
      try {
        const data: Store = await storeApi.getStoreById(storeId);
        const newValue: PostTemplate = {
          url: data?.url || '',
          templateId: data?.template.id || 0,
        };
        setStore(data);
        setTemplateForm(newValue);
        setSelectTemplateId(data?.template);
        //
      } catch (error) {
        // enqueueSnackbar(t('common.errorText'), { variant: 'error' });
      }
    })();
  }, [storeId]);
  useEffect(() => {
    dispatch(storeActions.fetchStoreTemplates(filter));
  }, [dispatch, filter]);
  const initialValues: PostTemplate = {
    url: '',
    templateId: 0,
    ...templateForm,
  } as PostTemplate;
  const handelStoreFormSubmit = async (formValues: PostTemplate) => {
    try {
      await storeApi.updateStoreTemplate(storeId, formValues);
      enqueueSnackbar(
        `${t('store.updateSuccessStart') + store?.name} ${t('store.updateSuccessEnd')}`,
        { variant: 'success' }
      );
      if (isStoreView === 'true') {
        navigate(`${PATH_DASHBOARD.store.details}/${storeId}`);
      } else {
        const newFilter = { ...filter };
        dispatch(storeActions.setFilter(newFilter));
        navigate(`${PATH_DASHBOARD.template.root}`);
      }
    } catch (error) {
      enqueueSnackbar(`${store?.name} ${t('common.errorText')} ,${t('store.storeCodeIsExisted')}`, {
        variant: 'error',
      });
    }
  };

  // header
  const { t } = useTranslation();

  const handelViewClick = (template: Template) => {
    setSelected(template);
    setPopup(true);
  };
  const handelSelectClick = (template: Template) => {
    setSelectTemplateId(template);
    enqueueSnackbar(t('store.selected') + template?.name, {
      variant: 'success',
    });
  };
  const handelPagingNumberChange = (e: any, page: number) => {
    dispatch(
      storeActions.setFilterTemplate({
        ...filter,
        page,
      })
    );
  };
  return (
    <Page title={t('store.editTemplate')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('store.listStore')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: isStoreView === 'true' ? t('store.title') : t('content.templates'),
              href:
                isStoreView === 'true'
                  ? `${PATH_DASHBOARD.store.root}`
                  : `${PATH_DASHBOARD.template.root}`,
            },
            {
              name: store?.name || '',
              href: `${PATH_DASHBOARD.store.details}/${storeId}`,
            },
            { name: t('store.editTemplate') },
          ]}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            {(!store?.template.id || Boolean(templateForm)) && (
              <TemplateForm
                initialValue={initialValues}
                onSubmit={handelStoreFormSubmit}
                storeName={store?.name || ''}
                selectedTemplateName={store?.template.name || ''}
                selectTemplate={selectTemplateId || undefined}
              />
            )}
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom marginBottom={2}>
                {t('content.listTemplate')}
              </Typography>
              <ShopProductList
                products={rs.results}
                isLoad={loading}
                onSelectTemplate={handelSelectClick}
                onViewTemplate={handelViewClick}
                selected={selectTemplateId}
              />
              <Box mt={2}>
                <Pagination
                  color="standard"
                  count={rs.totalNumberOfPages}
                  page={rs.pageNumber}
                  showFirstButton
                  showLastButton
                  onChange={handelPagingNumberChange}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Dialog open={popup} onClose={() => setPopup(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{selected?.name}</DialogTitle>
        <DialogContent style={{ marginTop: '15px' }}>
          <DialogContentText>
            <Card>
              <Box sx={{ pt: '100%', position: 'relative' }}>
                <ProductImgStyle alt="error" src={selected?.imageUrl} />
              </Box>
            </Card>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setPopup(false)}>
            {t('content.btnClose')}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
