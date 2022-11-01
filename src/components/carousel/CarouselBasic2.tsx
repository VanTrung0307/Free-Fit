import Slider from 'react-slick';
import { useState, useRef } from 'react';
// material
import { useTheme } from '@mui/material/styles';
import { Box, Card, Typography, CardContent } from '@mui/material';
// utils
import { CarouselControlsArrowsIndex } from './controls';

// ----------------------------------------------------------------------

const MOCK_CAROUSELS = [
  {
    id: 1,
    title: 'Tối ưu tuyến đường',
    image: 'https://wegodeliver.here.com/static/media/intro-step-2.baf96910.jpg',
    description: 'Tính toán lộ trình để tối ưu quá trình vận chuyển cho bạn.',
  },
  {
    id: 2,
    title: 'Dễ dàng lên kế hoạch',
    image: 'https://wegodeliver.here.com/static/media/intro-step-1.50160c57.jpg',
    description: 'Lên kế hoạch và quản lý việc giao hàng của riêng bạn chỉ trong vài bước',
  },
];
// ----------------------------------------------------------------------

type CarouselItemProps = {
  title: string;
  description: string;
  image: string;
};

function CarouselItem({ item }: { item: CarouselItemProps }) {
  const { image, title, description } = item;

  return (
    <>
      <Box
        component="img"
        alt={title}
        src={image}
        sx={{ width: '100%', height: 370, objectFit: 'cover' }}
      />

      <CardContent sx={{ textAlign: 'left' }}>
        <Typography variant="h6" noWrap gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography>
      </CardContent>
    </>
  );
}

export default function CarouselBasic2() {
  const theme = useTheme();
  const carouselRef = useRef<Slider | null>(null);
  const [currentIndex, setCurrentIndex] = useState(2);

  const settings = {
    dots: false,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: currentIndex,
    fade: Boolean(theme.direction !== 'rtl'),
    rtl: Boolean(theme.direction === 'rtl'),
    beforeChange: (current: number, next: number) => setCurrentIndex(next),
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Card>
      <Slider ref={carouselRef} {...settings}>
        {MOCK_CAROUSELS.map((item) => (
          <CarouselItem key={item.id} item={item} />
        ))}
      </Slider>

      <CarouselControlsArrowsIndex
        index={currentIndex}
        total={MOCK_CAROUSELS.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        sx={{ bottom: 120 }}
      />
    </Card>
  );
}
