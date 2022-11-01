import appstoreFilled from '@iconify/icons-ant-design/appstore-filled';
import { Icon } from '@iconify/react';
import AppsIcon from '@mui/icons-material/Apps';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
// routes
import i18n from 'translation/i18n';
import { PATH_DASHBOARD, PATH_PAGE } from '../../routes/paths';
// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const menuConfig = [
  {
    title: 'Sản phẩm',
    path: '/products',
    icon: <AppsIcon {...ICON_SIZE} />,
    children: [
      {
        subheader: 'Danh sách',
        items: [
          { title: 'Hệ thống quản lý giao hàng', path: PATH_PAGE.enterprise },
          { title: 'Ứng dụng cho tài xế', path: PATH_PAGE.driver },
          { title: 'Headless-TZM', path: '/' },
        ],
      },
    ],
  },
  { title: 'Tính năng', path: PATH_PAGE.features, icon: <FormatListBulletedIcon {...ICON_SIZE} /> },
];

export const rightMenuConfig = [
  {
    title: 'Doanh nghiệp',
    path: '/enterprise',
    icon: <Icon icon={appstoreFilled} {...ICON_SIZE} />,
  },
  {
    title: 'Startup',
    path: '/start-up',
    icon: <Icon icon={appstoreFilled} {...ICON_SIZE} />,
  },
  {
    title: 'Khách hàng',
    path: PATH_PAGE.client,
    icon: <Icon icon={appstoreFilled} {...ICON_SIZE} />,
  },
  {
    title: i18n.t('content.dashboard'),
    path: PATH_DASHBOARD.root,
    icon: <Icon icon={appstoreFilled} {...ICON_SIZE} />,
  },
];

export default menuConfig;
