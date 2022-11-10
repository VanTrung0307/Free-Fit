// material
import { Skeleton, Grid } from '@mui/material';
import { Template } from 'models';
import ShopProductCard from './ShopProductCard';

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <>
    {[...Array(12)].map((_, index) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '115%', borderRadius: 2 }} />
      </Grid>
    ))}
  </>
);

type ShopProductListProps = {
  products: Template[];
  isLoad: boolean;
  selected?: Template;
  onSelectTemplate?: (template: Template) => void;
  onViewTemplate?: (template: Template) => void;
};

export default function ShopProductList({
  products,
  isLoad,
  onSelectTemplate,
  onViewTemplate,
  selected,
}: ShopProductListProps) {
  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={4}>
          <ShopProductCard
            product={product}
            onSelect={() => {
              if (onSelectTemplate) onSelectTemplate(product);
            }}
            onView={() => {
              if (onViewTemplate) onViewTemplate(product);
            }}
            selected={selected}
          />
        </Grid>
      ))}
      {isLoad && SkeletonLoad}
    </Grid>
  );
}
