import { Box, Container, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import storeApi from 'api/storeApi';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import useSettings from 'hooks/useSettings';
import 'leaflet/dist/leaflet.css';
import { PostAttr } from 'models';
import { AttrResponse } from 'models/dto/attrResponse';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import AttrForm from '../components/AttrForm';
import { Block } from '../components/Block';
import './style.css';

interface EditAttrsPageProps {}
const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': { mx: '8px !important' },
} as const;
export default function EditAttrsPage(props: EditAttrsPageProps) {
  const { storeId, storeTypeId } = useParams();
  const [attrs, setAttrs] = useState<AttrResponse[]>();
  const { themeStretch } = useSettings();
  const { t } = useTranslation();
  const [value, setValue] = useState('1');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (!storeId) return;

    // IFFE
    (async () => {
      try {
        const data: AttrResponse[] = await storeApi.getAttrField(storeId, storeTypeId);
        setAttrs(data);
      } catch (error) {
        enqueueSnackbar(t('common.errorText'), { variant: 'error' });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId, storeTypeId]);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const handleBack = () => {
    navigate(`${PATH_DASHBOARD.store.details}/${storeId}`);
  };
  const handelSubmitForm = async (formValues: PostAttr[]) => {
    try {
      await storeApi.updateAttrs(storeId, formValues);
      enqueueSnackbar(t('store.updateAttrsSuccess'), { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(t('common.errorText'), { variant: 'error' });
    }
  };
  return (
    <Page title={t('store.detailsAttrsPage')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('store.attrList')}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: t('store.title'), href: PATH_DASHBOARD.store.root },
            { name: t('common.details'), href: `${PATH_DASHBOARD.store.details}/${storeId}` },
            { name: t('store.attrs') },
          ]}
        />
        <Box>
          <Block sx={style}>
            <TabContext value={value}>
              <TabList onChange={handleChange}>
                {attrs?.map((tab, index) => (
                  <Tab key={tab.id} label={tab.name} value={String(index + 1)} />
                ))}
              </TabList>
              <Box
                sx={{
                  p: 2,
                  mt: 2,

                  width: '100%',
                  borderRadius: 1,
                  bgcolor: 'grey.50012',
                }}
              >
                {attrs?.map((panel, index) => (
                  <TabPanel key={panel.id} value={String(index + 1)}>
                    <AttrForm
                      initialValue={panel.attrs}
                      isView={false}
                      id={panel.id}
                      key={panel.id}
                      onSubmit={handelSubmitForm}
                      onBack={handleBack}
                    />
                  </TabPanel>
                ))}
              </Box>
            </TabContext>
          </Block>
        </Box>
      </Container>
    </Page>
  );
}
