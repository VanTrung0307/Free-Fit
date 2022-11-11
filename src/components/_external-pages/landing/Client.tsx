// material
import { styled } from '@mui/material/styles';

// components
import Page from 'components/Page';
import ScrollToTop from 'components/ScrollToTop';
import ClientHero from '../client/ClientHero';
import EnterpriseContact from '../enterprise/EnterpriseContact';
import StartupInspiration from '../startup/StartupInspiration';
import StatupOverview from '../startup/StartupOverview';
import StartupPartner from '../startup/StartupPartner';

const RootStyle = styled(Page)(({ theme }) => ({
  height: '100%',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  overflowY: 'visible',
  overflowX: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(0, 0, 0),
}));

export default function ClientPage() {
  return (
    <RootStyle title="Khách hàng | FreeFit" id="move_top">
      <ClientHero />
      <ScrollToTop />
      <ContentStyle>
        <StatupOverview />
        <StartupPartner />
        {/* <StatupFeatures /> */}
        <StartupInspiration />
        <EnterpriseContact />
      </ContentStyle>
    </RootStyle>
  );
}
