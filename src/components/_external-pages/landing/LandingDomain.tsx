import { Box, Card, Container, Typography } from '@mui/material';
// material1
import { useTheme } from '@mui/material/styles';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
//
import { MotionInView, varFadeIn, varFadeInUp } from '../../animate';
import { CarouselControlsArrowsBasic2 } from '../../carousel';

// ----------------------------------------------------------------------

const MOCK_MEMBERS = [
  {
    title: 'Thức ăn',
    caption: '',
    image: '/static/home/food-domain.png',
  },
  {
    title: 'Tạp hóa',
    caption: '',
    image: '/static/home/grocery-domain.png',
  },
  {
    title: 'Giao nhận',
    caption: '',
    image: '/static/home/delivery-domain.png',
  },
  {
    title: 'Logistics',
    caption: '',
    image: '/static/home/logistics-domain.png',
  },
];

// ----------------------------------------------------------------------

type MemberCardProps = {
  member: {
    title: string;
    caption: string | undefined;
    image: string;
  };
};

function MemberCard({ member }: MemberCardProps) {
  const { title: name, caption: role, image: avatar } = member;
  return (
    <Card key={name} sx={{ p: 1, mx: 1.5 }}>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 0.5 }}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        {role}
      </Typography>
      <Box
        component="img"
        src={avatar}
        sx={{ width: '100%', height: 165, borderRadius: 1.5, objectFit: 'cover' }}
      />
      {/* <Box py={2}>
        <Button
          variant="text"
          endIcon={<Icon icon={roundArrowRightAlt} width={24} height={24} />}
          sx={{ mx: 'auto' }}
        >
          Xem thử
        </Button>
      </Box> */}
    </Card>
  );
}

export default function LandingDomain() {
  const carouselRef = useRef<Slider>(null);
  const theme = useTheme();
  const { t } = useTranslation();
  const settings = {
    slidesToShow: 4,
    centerMode: true,
    centerPadding: '0 80px',
    rtl: Boolean(theme.direction === 'rtl'),
    responsive: [
      {
        breakpoint: 1279,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 959,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Container maxWidth="lg" sx={{ pb: 10, textAlign: 'center' }}>
      <MotionInView variants={varFadeInUp}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          {t('ldPage.summary')}
        </Typography>
      </MotionInView>

      <MotionInView variants={varFadeInUp}>
        <Typography
          sx={{
            mb: 10,
            mx: 'auto',
            maxWidth: 630,
            color: (theme) => (theme.palette.mode === 'light' ? 'text.secondary' : 'common.white'),
          }}
          variant="h4"
        >
          {t('ldPage.subSumnary')}
        </Typography>
      </MotionInView>

      <Box sx={{ position: 'relative' }}>
        <Slider ref={carouselRef} {...settings}>
          {MOCK_MEMBERS.map((member) => (
            <MotionInView key={member.title} variants={varFadeIn}>
              <MemberCard member={member} />
            </MotionInView>
          ))}
        </Slider>
        <CarouselControlsArrowsBasic2
          onNext={handleNext}
          onPrevious={handlePrevious}
          sx={{ transform: 'translateY(-15px)' }}
        />
      </Box>
    </Container>
  );
}
