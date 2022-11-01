// material
import { styled } from '@mui/material/styles';

// components
import Page from 'components/Page';
import ScrollToTop from 'components/ScrollToTop';
import CustomerHero from '../customer-app/CustomerHero';
import CustomerOverview from '../customer-app/CustomerOverview';
import CustomerFeatures from '../customer-app/CustomerFeatures';
import EnterpriseContact from '../enterprise/EnterpriseContact';
import CustomerPartner from '../customer-app/CustomerPartner';

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
    <RootStyle title="Customer App | Trade Zone Map" id="move_top">
      <CustomerHero />
      <CustomerFeatures />

      <CustomerOverview />
      <CustomerPartner />
      <EnterpriseContact />
      <ScrollToTop />
    </RootStyle>
  );
}
