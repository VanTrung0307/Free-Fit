// material
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
} from '@mui/material';
// material
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
import { useNavigate } from 'react-router-dom';
// redux
// routes
import courseApi from 'api/FreeFitApi/courseApi';
import stepApi from 'api/FreeFitApi/stepApi';
import ResoTable from 'components/table/ResoTable';
import { TTableColumn } from 'components/table/table';
import { PATH_DASHBOARD } from 'routes/paths';
import { selectBrandTypeOptions, selectFilter, storeActions } from '../storeSlice';

export default function StepList() {
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
      await courseApi.remove(storeSelected?.id || 0);
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

  const [categoryName, setCategoryName] = useState<any>(null);
  const handleChange = (event: any, newValue: any) => {
    setCategoryName(newValue);
  };

  useEffect(() => {
    if (categoryName === null) {
      ref.current.formControl.setValue('categoryName', '');
      ref.current.formControl.setValue('categoryName', '');
    }
    if (ref.current && categoryName) {
      ref.current.formControl.setValue('categoryName', 'categoryName');
      ref.current.formControl.setValue('categoryName', categoryName.value);
    }
  }, [categoryName]);

  type TStepBase = {
    id?: number;
    video?: string;
    name?: string;
    image?: string;
    exerciseId?: number;
  };
  const stepColumn: TTableColumn<TStepBase>[] = [
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
      title: 'Tên Các Bước',
      dataIndex: 'name',
      hideInSearch: true,
      sortable: false,
    },
    {
      title: 'Video',
      dataIndex: 'video',
      hideInSearch: true,
      sortable: false,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      hideInSearch: true,
      render: (src, { name }) => (
        <Avatar alt={name} src={src} variant="square" style={{ width: '54px', height: '54px' }} />
      ),
    },
    {
      title: 'Mã bài tập',
      dataIndex: 'exerciseId',
      hideInSearch: true,
      sortable: false,
    },
  ];

  return (
    <FormProvider {...formMethod}>
      <Page title={'Bước Tập'}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading={'Bước Tập'}
            links={[
              { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
              { name: 'Bước Tập' },
            ]}
            // action={
            //   <Button
            //     variant="contained"
            //     component={RouterLink}
            //     to={PATH_DASHBOARD.exercise.add}
            //     startIcon={<Icon icon={plusFill} />}
            //   >
            //     {'Thêm PT'}
            //   </Button>
            // }
          />

          <Page>
            <ResoTable
              key={'exerciseId'}
              ref={ref}
              columns={stepColumn}
              getData={stepApi.getAll}
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
