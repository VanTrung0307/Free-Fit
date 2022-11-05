// routes
import { useTranslation } from 'react-i18next';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle
    src={`/static/icons/${name}.svg`}
    sx={{ width: '100%', height: '100%', display: 'inline-block' }}
  />
);

export const ICONS = {
  dashboard: getIcon('dashboard'),
  store: getIcon('ic-store'),
  poiBrand: getIcon('ic-poi'),
  poi: getIcon('s-poi'),
  map: getIcon('ic-map'),
  asset: getIcon('ic-asset'),
  settings: getIcon('ic-setting'),
  template: getIcon('ic-template'),
  groupZone: getIcon('ic-gz'),
  tradeZone: getIcon('tzVersion'),
  task: getIcon('ic-task1'),
  team: getIcon('ic-team'),
  agent: getIcon('ic-agent1'),
  tracking: getIcon('tracking'),
  order: getIcon('box'),
  list: getIcon('prioritize'),
  brand: getIcon('ic-team'),
  segment: getIcon('prioritize'),
  calendar: getIcon('navbar/ic_calendar'),
  customer: getIcon('ic_customer'),
};
export default function SidebarConfig() {
  const { t } = useTranslation();

  const sidebarConfig = [
    {
      subheader: t('common.general'),
      items: [
        {
          title: t('content.dashboard'),
          path: PATH_DASHBOARD.analytics,
          icon: ICONS.dashboard,
        },
        {
          title: 'Báo cáo',
          path: PATH_DASHBOARD.overviewDate,
          icon: ICONS.calendar,
        },
        {
          title: t('content.asset'),
          path: PATH_DASHBOARD.asset.root,
          icon: ICONS.asset,
          children: [
            { title: t('asset.list'), path: PATH_DASHBOARD.asset.assets },
            { title: t('asset.violationLogs'), path: PATH_DASHBOARD.asset.violations },
          ],
        },
        {
          title: 'Cửa hàng',
          path: PATH_DASHBOARD.store.root,
          icon: ICONS.store,
        },
        {
          title: 'Customer',
          path: PATH_DASHBOARD.customer.root,
          icon: ICONS.customer,
        },
        {
          title: 'Club',
          path: PATH_DASHBOARD.club.root,
          icon: ICONS.team,
        },
      ],
    },
    {
      subheader: t('common.delivery'),
      items: [
        {
          title: t('common.order'),
          path: PATH_DASHBOARD.order.root,
          icon: ICONS.order,
        },
        {
          title: t('common.task'),
          path: PATH_DASHBOARD.task.root,
          icon: ICONS.task,
        },
        {
          title: t('common.tracking'),
          path: PATH_DASHBOARD.tracking.root,
          icon: ICONS.tracking,
        },
        // {
        //   title: t('common.agent'),
        //   path: PATH_DASHBOARD.agent.root,
        //   icon: ICONS.agent,
        // },
      ],
    },
    {
      subheader: t('common.businessArea'),
      items: [
        { title: t('content.map'), path: PATH_DASHBOARD.general.brandMap, icon: ICONS.map },
        {
          title: t('tz.calendar'),
          path: PATH_DASHBOARD.tradeZone.tradeZoneCalendar,
          icon: ICONS.tradeZone,
        },
        {
          title: t('tz.tzVersion'),
          path: PATH_DASHBOARD.tradeZone.tradeZoneVersion,
          icon: ICONS.list,
        },
        // {
        //   title: t('common.tradeZone'),
        //   path: PATH_DASHBOARD.tradeZone.root,
        //   icon: ICONS.tradeZone,
        //   children: [
        //     { title: t('tz.calendar'), path: PATH_DASHBOARD.tradeZone.tradeZoneCalendar },
        //     { title: t('tz.tzVersion'), path: PATH_DASHBOARD.tradeZone.tradeZoneVersion },
        //     { title: t('tz.tzList'), path: PATH_DASHBOARD.tradeZone.tradeZones },
        //   ],
        // },
      ],
    },
    {
      subheader: t('content.system'),
      items: [{ title: t('setting.menu'), path: PATH_DASHBOARD.system.root, icon: ICONS.settings }],
    },
  ];
  return sidebarConfig;
}
