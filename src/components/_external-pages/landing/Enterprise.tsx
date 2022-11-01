// material
import { styled } from '@mui/material/styles';

// components
import Page from 'components/Page';
import ScrollToTop from 'components/ScrollToTop';
import EnterpriseHero from '../enterprise/EnterpriseHero';
import EnterpriseHIW from '../enterprise/EnterpiseHIW';
import EnterpriseFeatures from '../enterprise/EnterpriseFeatures';
import EnterpriseScale from '../enterprise/EnterpriseScale';
import EnterprisePartner from '../enterprise/EnterprisePartner';
import EnterpriseContact from '../enterprise/EnterpriseContact';

const RootStyle = styled(Page)(({ theme }) => ({
  height: '100%',
}));

// const ContentStyle = styled('div')(({ theme }) => ({
//   overflowY: 'visible',
//   overflowX: 'hidden',
//   position: 'relative',
//   backgroundColor: theme.palette.background.neutral,
//   padding: theme.spacing(0, 0, 0),
// }));

export default function EnterprisePage() {
  return (
    <RootStyle title="DMS | Trade Zone Map" id="move_top">
      <EnterpriseHero />
      <EnterprisePartner />
      <EnterpriseFeatures />
      <EnterpriseScale />
      <EnterpriseHIW />
      <EnterpriseContact />
      <ScrollToTop />
    </RootStyle>
  );
}
