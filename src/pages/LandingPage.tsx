// material
import { styled } from '@mui/material/styles';
import LandingDomain from 'components/_external-pages/landing/LandingDomain';
import LandingOptimize from 'components/_external-pages/landing/LandingOptimize';
import LandingPartner from 'components/_external-pages/landing/LandingPartner';
import LandingWhitePlatform from 'components/_external-pages/landing/LandingWhitePlatform';
import { useTranslation } from 'react-i18next';
// components
import Page from '../components/Page';
import {
  LandingAdvertisement,
  LandingHero,
  LandingMinimal,
} from '../components/_external-pages/landing';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)({
  height: '100%',
});

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(0),
}));

// ----------------------------------------------------------------------

export default function LandingPage() {
  const { t } = useTranslation();
  return (
    <RootStyle title={t('ldPage.title')} id="move_top">
      <LandingHero />
      <ContentStyle>
        <LandingMinimal />
        <LandingPartner />
        <LandingOptimize />
        <LandingWhitePlatform />
        <LandingDomain />
        <LandingAdvertisement />
      </ContentStyle>
    </RootStyle>
  );
}
