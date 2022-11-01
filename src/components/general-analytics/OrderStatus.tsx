import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
// material
import { useTheme } from '@mui/material/styles';
import { useAppSelector } from 'app/hooks';
import EmptyContent from 'components/EmptyContent';
import Label from 'components/Label';
import Scrollbar from 'components/Scrollbar';
import { OrderEnum } from 'constants/orderEnum';
import { selectOrderList } from 'features/order/orderSlice';
import { GetStatusOrderMap } from 'models/dto/orderStatus';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
// ----------------------------------------------------------------------

export default function OrderStatus() {
  const theme = useTheme();
  const { t } = useTranslation();
  const rs = useAppSelector(selectOrderList);
  const { statusOrderMap } = GetStatusOrderMap();

  return (
    <Card>
      <CardHeader title={t('dashboard.orderReport')} sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('order.code')}</TableCell>
                <TableCell>{t('order.end')}</TableCell>
                <TableCell>{t('order.items')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {rs.results?.length === 0 && (
                <TableRow style={{ height: 53 * 10 }}>
                  <TableCell colSpan={20}>
                    <Box width="100%">
                      <EmptyContent
                        title={t('common.noData')}
                        sx={{
                          width: '100%',
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {rs.results
                .filter(
                  (x) =>
                    x.status === OrderEnum.New ||
                    x.status === OrderEnum.PickedUp ||
                    x.status === OrderEnum.Assigned
                )
                ?.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell align="left">{e?.orderCode}</TableCell>
                    <TableCell align="left">{e?.toStation?.address}</TableCell>
                    <TableCell width={130} align="left">
                      {e?.packageItems?.length}
                    </TableCell>
                    <TableCell width={160}>
                      <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={
                          (e.status === OrderEnum.New && 'success') ||
                          (e.status === OrderEnum.PickedUp && 'warning') ||
                          'info'
                        }
                      >
                        {statusOrderMap[e.status].name}
                      </Label>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          to={PATH_DASHBOARD.order.root}
          size="small"
          color="inherit"
          component={RouterLink}
          endIcon={<Icon icon={arrowIosForwardFill} />}
        >
          {t('common.viewMore')}
        </Button>
      </Box>
    </Card>
  );
}
