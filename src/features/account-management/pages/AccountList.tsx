import editFill from '@iconify/icons-eva/edit-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
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
import accountApi from 'api/accountApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useTable } from 'components/common';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
// hooks
import useSettings from 'hooks/useSettings';
import { GetStatusMap, PaginationRequest, Store, Brand, Account } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import AccountFilter from '../components/AccountFilter';
import {
  selectFilter,
  selectLoading,
  selectAccountsResponse,
  accountActions,
} from '../accountSlice';

// ----------------------------------------------------------------------

export default function AccountList() {
  const { themeStretch } = useSettings();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [accountSelected, setAccountSelected] = useState<Account>();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const rs = useAppSelector(selectAccountsResponse);
  const loading = useAppSelector(selectLoading);
  const { statusMap } = GetStatusMap();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // effect
  useEffect(() => {
    dispatch(accountActions.fetchAccounts(filter));
  }, [dispatch, filter]);

  const onPageChange = (page: number) => {
    dispatch(
      accountActions.setFilter({
        ...filter,
        page: page + 1,
      })
    );
  };
  const onRowPerPageChange = (perPage: number) => {
    dispatch(
      accountActions.setFilter({
        ...filter,
        pageSize: perPage,
      })
    );
  };
  const onSortChange = (colName: string, sortType: number) => {
    dispatch(
      accountActions.setFilter({
        ...filter,
        colName,
        sortType,
      })
    );
  };
  const handelSearchDebounce = (newFilter: PaginationRequest) => {
    dispatch(accountActions.setFilterWithDebounce(newFilter));
  };

  const handelRemoveClick = (account: Account) => {
    setAccountSelected(account);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    try {
      await accountApi.remove(accountSelected?.id || 0);
      const newFilter = { ...filter };
      dispatch(accountActions.setFilter(newFilter));
      enqueueSnackbar(`${accountSelected?.brandName} ${t('account.deleteSuccess')}`, {
        variant: 'success',
      });

      setAccountSelected(undefined);
      setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(`${accountSelected?.brandName} ${t('common.errorText')}`, {
        variant: 'error',
      });
    }
  };

  // header
  const { t } = useTranslation();
  const headCells = [
    { id: 'no', label: '#' },
    { id: 'brandName', label: t('account.brandName') },
    { id: 'fullName', label: t('account.accountName') },
    { id: 'phoneNumber', label: t('account.phoneNumber') },
    { id: 'email', label: t('account.email') },
    { id: 'role', label: t('account.role') },
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
  const handelDetailsClick = (account: Account) => {
    navigate(`${PATH_DASHBOARD.account.details}/${account.id}`);
  };
  return (
    <Page title={t('account.title')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('account.listAccount')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('account.listAccount') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.account.add}
              startIcon={<Icon icon={plusFill} />}
            >
              {t('account.btnAdd')}
            </Button>
          }
        />

        <Card>
          <AccountFilter filter={filter} onSearchChange={handelSearchDebounce} />

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

                  {rs.results?.map((e, idx) => (
                    <TableRow key={e.id}>
                      <TableCell width={80} component="th" scope="row" padding="none">
                        {idx + 1}
                      </TableCell>
                      <TableCell align="left">{e.brandName}</TableCell>
                      <TableCell align="left">{e.fullname}</TableCell>
                      <TableCell align="left">{e.phoneNumber}</TableCell>
                      <TableCell align="left">{e.email}</TableCell>
                      <TableCell align="left">{e.role}</TableCell>
                      <TableCell width={250}>
                        <Box style={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip key={`btnDetails-${e.id}`} title={t('common.details') || ''}>
                            <IconButton
                              color="info"
                              onClick={() => handelDetailsClick(e)}
                              size="large"
                            >
                              <Icon icon={editFill} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip key={`btnDelete-${e.id}`} title={t('common.remove') || ''}>
                            <IconButton
                              color="error"
                              onClick={() => handelRemoveClick(e)}
                              size="large"
                            >
                              <Icon icon={trash2Outline} />
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
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>{t('common.titleConfirm')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`${t('store.removeTitleStart') + accountSelected?.email} ${t('store.removeTitleEnd')}`}
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
  );
}
