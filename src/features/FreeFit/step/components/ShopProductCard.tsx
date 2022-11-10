// material
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Template } from 'models';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')(({ theme }) => ({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
}));

// ----------------------------------------------------------------------

type ShopProductCardProps = {
  product: Template;
  selected?: Template;
  onSelect?: (template: Template) => void;
  onView?: (template: Template) => void;
};

export default function ShopProductCard({
  product,
  onSelect,
  onView,
  selected,
}: ShopProductCardProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <ProductImgStyle alt="error" src={product.imageUrl} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="subtitle2" noWrap>
          {product.name}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box
            style={{
              display: 'flex',
              flexFlow: 'row nowrap',
              justifyContent: 'flex-end',
              alignContent: 'center',
              backgroundColor: '#fff',
              width: '100%',
              height: '100%',
            }}
          >
            <Button
              color={selected?.id === product.id ? 'inherit' : 'secondary'}
              size="small"
              disabled={selected?.id === product.id}
              onClick={() => {
                if (onSelect) onSelect(product);
              }}
            >
              {t('common.select')}
            </Button>
            <Button
              type="submit"
              size="small"
              onClick={() => {
                if (onView) onView(product);
              }}
            >
              {t('common.view')}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}
