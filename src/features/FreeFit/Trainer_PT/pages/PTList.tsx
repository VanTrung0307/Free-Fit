import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
// material
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
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
import { Visibility } from '@mui/icons-material';
import ResoTable from 'components/table/ResoTable';
import { TTableColumn } from 'components/table/table';
import { PATH_DASHBOARD } from 'routes/paths';
import { fDate, fDateTimeSuffix2 } from 'utils/formatTime';
import { selectBrandTypeOptions, selectFilter, storeActions } from '../storeSlice';

export default function PTList() {
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

  type TStoreBase = {
    address?: string;
    brandId?: number;
    brandName?: string;
    building?: { id?: any; isEditable?: boolean; name?: string };
    buildingId?: number;
    createDate?: string;
    id?: number;
    imageUrl?: string;
    name?: string;
    status?: number;
    storeCode?: string;
    storeTypeId?: number;
    storeTypeName?: string;
    type?: string;
    SearchBy?: string;
    KeySearch?: string;
    phone?: string;
    bank?: string;
  };
  const storeColumn: TTableColumn<TStoreBase>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      hideInSearch: true,
      sortable: false,
    },
    // { title: 'Họ và Tên', dataIndex: 'brandName', hideInSearch: true, sortable: false },
    // {
    //   title: 'Họ và Tên',
    //   dataIndex: 'brandName',
    //   hideInTable: true,
    //   valueEnum: brandTypeOptions.map((item) => ({ label: item.name, value: item.id })),
    //   render(value, data, index) {
    //     return value;
    //   },
    //   renderFormItem() {
    //     return (
    //       <Autocomplete
    //         value={brandName}
    //         onChange={handleChange}
    //         id="controllable-states-demo"
    //         options={brandOptions}
    //         renderInput={(params) => <TextField {...params} label="Tên thương hiệu" />}
    //       />
    //     );
    //   },
    //   sortable: false,
    // },
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
      hideInSearch: true,
      sortable: false,
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'KeySearch',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: brandName!,
      sortable: false,
    },
    {
      title: 'Ngày Sinh',
      dataIndex: 'createDate',
      hideInSearch: true,
      hideInTable: false,
      sortable: false,
      render(value, data, index) {
        return <Box>{fDate(data?.createDate!)}</Box>;
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      hideInSearch: true,
      sortable: false,
    },
    {
      title: 'Email',
      dataIndex: 'brandId',
      hideInSearch: true,
      sortable: false,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      hideInSearch: true,
      render(value, data, index) {
        return (
          <Typography color={statusMap[value].color} fontWeight="bold">
            {statusMap[value].name}
          </Typography>
        );
      },
      sortable: false,
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createDate',
      hideInSearch: true,
      hideInTable: false,
      sortable: false,
      render(value, data, index) {
        return <Box>{fDateTimeSuffix2(data?.createDate!)}</Box>;
      },
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'address',
      hideInSearch: true,
      sortable: false,
    },
  ];

  return (
    <FormProvider {...formMethod}>
      <Page title={'Customer'}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading={'PT'}
            links={[{ name: t('content.dashboard'), href: PATH_DASHBOARD.root }, { name: 'PT' }]}
            action={
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.pt.add}
                startIcon={<Icon icon={plusFill} />}
              >
                {'Thêm PT'}
              </Button>
            }
          />

          <Page>
            <ResoTable
              key={'store-id'}
              ref={ref}
              columns={storeColumn}
              getData={storeApi.getAllPaging}
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
