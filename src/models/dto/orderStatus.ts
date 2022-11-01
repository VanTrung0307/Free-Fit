import { useTranslation } from 'react-i18next';
import { Status, StatusMap } from './status';

export function GetStatusOrderMap() {
  const { t } = useTranslation();
  const statusOrderMap: StatusMap = {
    9: { name: t('status.all'), color: 'black' },
    0: { name: t('order.new'), color: 'green' },
    1: { name: t('order.assigned'), color: 'goldenrod' },
    2: { name: t('order.removed'), color: 'red' },
    3: { name: t('order.pickedUp'), color: 'goldenrod' },
    4: { name: t('order.delivered'), color: 'green' },
    5: { name: t('order.cancel'), color: 'red' },
  };
  const paymentMethod: StatusMap = {
    1: { name: 'Tiền mặt', color: 'red' },
    2: { name: 'Chuyển khoản sau', color: 'black' },
    3: { name: 'Tiền mặt', color: 'red' },
    4: { name: 'Đã thanh toán trước', color: 'green' },
  };
  const statusOrderFilter: Status[] = [
    { id: 0, name: t('order.new') },
    { id: 1, name: t('order.assigned') },
    { id: 2, name: t('order.removed') },
    { id: 3, name: t('order.pickedUp') },
    { id: 4, name: t('order.delivered') },
    { id: 5, name: t('order.cancel') },
  ];
  return { statusOrderMap, statusOrderFilter, paymentMethod };
}
