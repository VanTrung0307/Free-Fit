import { Box, Container, Grid } from '@mui/material';
import tzVersionApi from 'api/tradeZoneVersionApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import { groupZoneActions } from 'features/group-zone/groupZoneSlice';
import useSettings from 'hooks/useSettings';
import { PutTzVersion, StoresName, TzVersion } from 'models';
import { GetConstantTimeFilter } from 'models/dto/timeFilter';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { convertBinaryFilterToList, convertListToBinaryFilter, getCurrentUser } from 'utils/common';
import TzVersionViewEditForm from '../components/TzVersionViewEditForm';
import { selectFilter, tzVersionActions } from '../tzVersionSlice';

export default function EditTzVersionPage() {
  const { tzVersionId } = useParams();
  const isEdit = Boolean(tzVersionId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [tzVersion, setTzVersion] = useState<TzVersion>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  const user = getCurrentUser();
  const { timeFilterOptions, dateFilterOptions } = GetConstantTimeFilter();
  useEffect(() => {
    dispatch(groupZoneActions.fetchGroupZoneList());
  }, [dispatch]);
  useEffect(() => {
    if (!tzVersionId) return;

    // IFFE
    (async () => {
      try {
        const data: TzVersion = await tzVersionApi.getById(tzVersionId);
        const dateSelected = convertBinaryFilterToList(data?.dateFilter);
        const timeSelected = convertBinaryFilterToList(data?.timeSlot);
        const dateSelectedList = dateFilterOptions.filter(({ id }) => dateSelected.includes(id));
        const timeSelectedList = timeFilterOptions.filter(({ id }) => timeSelected.includes(id));
        data.dateOptions = dateSelectedList;
        data.timeOptions = timeSelectedList;
        setTzVersion(data);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tzVersionId]);
  const handelStoreFormSubmit = async (formValues: TzVersion) => {
    if (!isEdit) {
      try {
        if (!user) return;
        const dateFilter = convertListToBinaryFilter(7, formValues.dateOptions || []);
        const timeFilter = convertListToBinaryFilter(24, formValues.timeOptions || []);
        const valueUpdate = {
          name: formValues.name,
          dateFilter,
          timeSlot: timeFilter,
          description: formValues.description,
          brandId: user.brandId,
          groupZoneId: formValues.groupZoneId,
          stores: formValues.storesName as StoresName[],
        } as PutTzVersion;

        await tzVersionApi.add(valueUpdate);
        enqueueSnackbar(`${formValues?.name} ${t('asset.addSuccess')}`, { variant: 'success' });
        const newFilter = { ...filter };
        dispatch(tzVersionActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.tradeZone.tradeZoneVersion);
      } catch (error) {
        enqueueSnackbar(`${formValues?.name} ${t('common.errorText')}`, { variant: 'error' });
      }
    } else {
      try {
        const dateFilter = convertListToBinaryFilter(7, formValues.dateOptions || []);
        const timeFilter = convertListToBinaryFilter(24, formValues.timeOptions || []);
        const valueUpdate = {
          name: formValues.name,
          dateFilter,
          timeSlot: timeFilter,
          description: formValues.description,
        } as PutTzVersion;
        await tzVersionApi.update(tzVersionId, valueUpdate);
        enqueueSnackbar(
          `${t('tz.updateSuccessTzVStart') + formValues.name} ${t('tz.updateSuccessEnd')}`,
          { variant: 'success' }
        );
        const newFilter = { ...filter };
        dispatch(tzVersionActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.tradeZone.tradeZoneVersion);
      } catch (error) {
        enqueueSnackbar(`${formValues?.name} ${t('common.errorText')}`, { variant: 'error' });
      }
    }
  };
  const initialValues: TzVersion = {
    name: '',
    dateFilter: '0000000',
    timeSlot: '000000000000000000000000',
    description: '',
    groupZoneId: 0,
    dateOptions: [],
    timeOptions: [],
    storesName: [],
    ...tzVersion,
  } as TzVersion;
  return (
    <Page title={isEdit ? t('tz.editTitle') : t('tz.addTitle')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isEdit ? t('tz.editTitle') : t('tz.addTitle')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('tz.tzVersion'), href: PATH_DASHBOARD.tradeZone.tradeZoneVersion },
            {
              name: isEdit ? tzVersion?.name || '' : t('tz.addTitle'),
            },
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              {(!isEdit || Boolean(tzVersion)) && (
                <TzVersionViewEditForm
                  initialValue={initialValues}
                  onSubmit={handelStoreFormSubmit}
                  isView={false}
                  isEdit={isEdit}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
