import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import accountApi from 'api/accountApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import { selectFilter } from 'features/pois-brand/poiBrandSlice';
import useSettings from 'hooks/useSettings';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PostStore, Store, Brand, PostBrand, Account, PostAccount } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { getCurrentUser } from 'utils/common';
import AccountForm from '../components/AccountForm';
import { accountActions } from '../accountSlice';
import './style.css';

interface AddEditBrandPageProps {}

export default function AddEditBrandPage(props: AddEditBrandPageProps) {
  const { accountId } = useParams();
  const isEdit = Boolean(accountId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [account, setAccount] = useState<PostAccount>();
  const [location, setLocation] = useState<LatLngExpression>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  const user = getCurrentUser();
  useEffect(() => {
    dispatch(accountActions.fetchBrandType());
  }, [dispatch]);
  useEffect(() => {
    if (!accountId) return;

    // IFFE
    (async () => {
      try {
        const data: Account = await accountApi.getAccountById(accountId);

        // let postLocation: string = '';
        // if (data?.geom?.coordinates) {
        //   const detailsLocation: LatLngExpression = [
        //     data?.geom?.coordinates[1],
        //     data?.geom?.coordinates[0],
        //   ];

        //   postLocation = `${data?.geom?.coordinates[0]} ${data?.geom?.coordinates[1]}`;
        //   setLocation(detailsLocation);
        // }
        const newValue: PostAccount = {
          fullname: data?.fullname || '',
          phoneNumber: data?.phoneNumber || '',
          email: data?.email || '',
          role: 1,
          imageUrl: data?.imageUrl || '',
          brandId: data?.brandId || 0,
          password: '',
        };
        setAccount(newValue);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, [accountId]);
  const handelAccountFormSubmit = async (formValues: PostAccount) => {
    if (!isEdit) {
      try {
        if (!user) return;
        await accountApi.add(formValues);
        enqueueSnackbar(`${formValues?.email} ${t('brand.addSuccess')}`, { variant: 'success' });
        const newFilter = { ...filter };
        dispatch(accountActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.account.root);
      } catch (error) {
        enqueueSnackbar(
          `${formValues?.email} ${t('common.errorText')} ,${t('account.accountIsExisted')}`,
          { variant: 'error' }
        );
      }
    } else {
      try {
        if (!user) return;
        await accountApi.update(Number(accountId), formValues);
        enqueueSnackbar(
          `${t('account.updateSuccessStart') + formValues.email} ${t('account.updateSuccessEnd')}`,
          { variant: 'success' }
        );
        const newFilter = { ...filter };
        dispatch(accountActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.account.root);
      } catch (error) {
        enqueueSnackbar(
          `${formValues?.email} ${t('common.errorText')} ,${t('account.accountIsExisted')}`,
          { variant: 'error' }
        );
      }
    }
  };
  const initialValues: PostAccount = {
    fullname: '',
    phoneNumber: '',
    email: '',
    role: 1,
    imageUrl: '',
    brandId: 0,
    password: '',
    ...account,
  } as PostAccount;

  const links = [
    { name: 'Dashboard', href: PATH_DASHBOARD.root },
    { name: t('brand.title'), href: PATH_DASHBOARD.account.root },
    { name: !isEdit ? t('account.btnAdd') : t('account.editInfo') },
  ];
  if (isEdit) {
    links.push({
      name: account?.email || '',
      href: `${PATH_DASHBOARD.account.details}/${accountId}`,
    });
  }
  return (
    <Page title={!isEdit ? t('account.formAdd') : t('account.detailsAccount')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? t('account.formAdd') : t('account.detailsAccount')}
          links={links}
        />
        <Box>
          {(!isEdit || Boolean(account)) && (
            <AccountForm
              initialValue={initialValues}
              onSubmit={handelAccountFormSubmit}
              isEdit={isEdit}
            />
          )}
        </Box>
      </Container>
    </Page>
  );
}
