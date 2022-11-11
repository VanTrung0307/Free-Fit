import { Box, Container } from '@mui/material';
import clubApi from 'api/FreeFitApi/clubApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import { selectFilter } from 'features/pois-brand/poiBrandSlice';
import useSettings from 'hooks/useSettings';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Club, PostClub } from 'models/freefit/club';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { getCurrentUser } from 'utils/common';
import ClubForm from '../components/ClubForm';
import { clubActions, selectBuilding } from '../storeSlice';
import './style.css';

interface AddEditClubPageProps {}
// const ThumbImgStyle = styled('img')(({ theme }) => ({
//   width: 300,
//   height: 300,
//   objectFit: 'cover',
//   margin: theme.spacing(0, 2),
//   borderRadius: theme.shape.borderRadiusSm,
// }));

export default function AddEditClubPage(props: AddEditClubPageProps) {
  const { Id } = useParams();
  const isEdit = Boolean(Id);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [club, setClub] = useState<PostClub>();
  const [location, setLocation] = useState<LatLngExpression>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  const user = getCurrentUser();
  const [buildingId, setBuildingId] = useState(0);
  useEffect(() => {
    dispatch(clubActions.fetchStoreType());
    dispatch(clubActions.fetchProvince());
    dispatch(clubActions.fetchBuilding(buildingId));
  }, [dispatch, buildingId]);

  const locations = useLocation();
  const params = new URLSearchParams(locations.search);
  const pageNum = Number(params.get('page'));
  const pagePresent = Number(localStorage.getItem('page'));

  const buildingOptions = useAppSelector(selectBuilding);
  useEffect(() => {
    if (!Id) return;

    // IFFE
    (async () => {
      try {
        const data: Club = await clubApi.getClubById(Id);

        const newValue: PostClub = {
          address: data?.address || '',
          area: data?.area || '',
          managerName: data?.managerName || '',
        };

        setClub(newValue);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, [Id]);
  const handelClubFormSubmit = async (formValues: PostClub) => {
    if (!isEdit) {
      try {
        if (!user) return;
        await clubApi.add(formValues);
        enqueueSnackbar(`${formValues?.address} ${'Thêm  Club thành công'}`, {
          variant: 'success',
        });
        const newFilter = { ...filter };
        dispatch(clubActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.club.root);
      } catch (error) {
        enqueueSnackbar(
          `${formValues?.address} ${t('common.errorText')} ,${t('store.storeCodeIsExisted')}`,
          { variant: 'error' }
        );
      }
    } else {
      try {
        if (!user) return;
        await clubApi.update(Number(Id), formValues);
        enqueueSnackbar(
          `${t('store.updateSuccessStart') + formValues.address} ${t('store.updateSuccessEnd')}`,
          { variant: 'success' }
        );
        const newFilter = { ...filter };
        dispatch(clubActions.setFilter({ ...filter, page: pagePresent }));
        navigate(PATH_DASHBOARD.club.root);
      } catch (error) {
        enqueueSnackbar(
          `${formValues?.address} ${t('common.errorText')} ,${t('store.storeCodeIsExisted')}`,
          { variant: 'error' }
        );
      }
    }
  };
  const initialValues: PostClub = {
    address: '',
    area: '',
    managerName: '',
    ...club,
  } as PostClub;

  const links = [
    { name: 'Dashboard', href: PATH_DASHBOARD.root },
    { name: 'Quản lí Phòng tập', href: PATH_DASHBOARD.club.root },
    { name: !isEdit ? 'Thêm mới Phòng tập' : t('store.editInfo') },
  ];
  if (isEdit) {
    links.push({
      name: club?.address || '',
      href: `${PATH_DASHBOARD.club.details}/${Id}`,
    });
  }
  return (
    <Page title={!isEdit ? 'Thêm mới Phòng tập' : t('store.detailsStore')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm mới Phòng tập' : t('store.detailsStore')}
          links={links}
        />
        <Box>
          {(!isEdit || Boolean(club)) && (
            <ClubForm
              initialValue={initialValues}
              onSubmit={handelClubFormSubmit}
              isEdit={isEdit}
            />
          )}
        </Box>
      </Container>
    </Page>
  );
}
