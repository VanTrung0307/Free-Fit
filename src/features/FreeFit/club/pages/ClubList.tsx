import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
// material
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
// material
import storeApi from 'api/storeApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
// hooks
import useSettings from 'hooks/useSettings';
import { GetStatusMap, Store } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
// routes
import clubApi from 'api/FreeFitApi/clubApi';
import ResoTable from 'components/table/ResoTable';
import { TTableColumn } from 'components/table/table';
import { PATH_DASHBOARD } from 'routes/paths';
import { selectBrandTypeOptions, selectFilter, storeActions } from '../storeSlice';

export default function ClubList() {
  const { themeStretch } = useSettings();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [storeSelected, setStoreSelected] = useState<Store>();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const { statusMap } = GetStatusMap();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const ref = useRef<any>(null);
  const navigate = useNavigate();
  const formMethod = useForm<any>();
  const brandTypeOptions = useAppSelector(selectBrandTypeOptions);

  useEffect(() => {
    dispatch(storeActions.fetchBrandType());
    dispatch(storeActions.fetchProvince());
  }, [dispatch, filter]);

  const handelRemoveClick = (store: Store) => {
    setStoreSelected(store);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    try {
      await storeApi.remove(storeSelected?.id || 0);
      const newFilter = { ...filter };
      dispatch(storeActions.setFilter(newFilter));
      enqueueSnackbar(`${storeSelected?.name} ${t('store.deleteSuccess')}`, { variant: 'success' });

      setStoreSelected(undefined);
      setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(`${storeSelected?.name} ${t('common.errorText')}`, { variant: 'error' });
    }
  };

  const brandOptions = brandTypeOptions.map((c) => ({ label: c.name, value: c.id }));

  const [brandName, setBrandName] = useState<any>(null);
  const handleChange = (event: any, newValue: any) => {
    setBrandName(newValue);
  };

  useEffect(() => {
    if (brandName === null) {
      ref.current.formControl.setValue('SearchBy', '');
      ref.current.formControl.setValue('KeySearch', '');
    }
    if (ref.current && brandName) {
      ref.current.formControl.setValue('SearchBy', 'Brand');
      ref.current.formControl.setValue('KeySearch', brandName.value);
    }
  }, [brandName]);

  type TClubBase = {
    id?: number;
    address?: string;
    area?: string;
    managerName?: string;
  };
  const clubColumn: TTableColumn<TClubBase>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      hideInSearch: true,
      sortable: false,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      sortable: false,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      hideInSearch: true,
      sortable: false,
    },
    {
      title: 'Khu vực',
      dataIndex: 'area',
      hideInSearch: true,
      sortable: false,
    },
    {
      title: 'Người quản lí',
      dataIndex: 'managerName',
      hideInSearch: true,
      sortable: false,
    },
  ];

  return (
    <FormProvider {...formMethod}>
      <Page title={t('store.title')}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading={'Phòng tập'}
            links={[
              { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
              { name: 'Phòng tập' },
            ]}
            action={
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.club.add}
                startIcon={<Icon icon={plusFill} />}
              >
                {'Thêm Phòng Tập'}
              </Button>
            }
          />

          <Page>
            <ResoTable
              key={'store-id'}
              ref={ref}
              columns={clubColumn}
              getData={clubApi.getAll}
              showAction={true}
              onDelete={handelRemoveClick}
              onEdit={(e) => navigate(`${PATH_DASHBOARD.store.details}/${e.id}`)}
            />
          </Page>
        </Container>
        <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
          <DialogTitle>{t('common.titleConfirm')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`${t('store.removeTitleStart') + storeSelected?.name} ${t('store.removeTitleEnd')}`}
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
      </Page>
    </FormProvider>
  );
}
