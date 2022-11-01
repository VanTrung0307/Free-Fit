import { useTranslation } from 'react-i18next';

export interface TransportType {
  id?: number;
  name: string;
}
export interface TransportTypeMap {
  [key: number]: TransportType;
}

export function GetTransportTypeMap() {
  const { t } = useTranslation();
  const transportTypeMap: TransportTypeMap = {
    0: { name: t('status.all') },
    1: { name: t('agent.truck') },
    2: { name: t('agent.motorcycle') },
    3: { name: t('agent.oto') },
  };
  const transportTypeFilter: TransportType[] = [
    { id: 1, name: t('agent.truck') },
    { id: 2, name: t('agent.motorcycle') },
    { id: 3, name: t('agent.oto') },
  ];
  return { transportTypeMap, transportTypeFilter };
}
