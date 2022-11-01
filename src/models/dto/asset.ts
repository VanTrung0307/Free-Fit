import { useTranslation } from 'react-i18next';
import { PaginationRequest } from './common';

export interface Asset {
  id: string;
  name: string;
  type: number;
  storeId: number;
  storeName: string;
  isDeleted: boolean;
  transportDescription: string;
  licencePlate: string;
  color: string;
  manufacturer: string;
}
export interface AssetPagingRequest extends PaginationRequest {
  typeAsset?: number;
  storeId?: number;
}
export interface AssetViolation {
  id: number;
  startTime: Date;
  endTime: Date;
  description: string;
  assetId: string;
  assetName: string;
  storeId: number;
  storeName: string;
  typeViolation: number;
  severity: number;
}
export interface TypeAsset {
  id?: number;
  name: string;
}
export interface TypeAssetMap {
  [key: number]: TypeAsset;
}

export function GetAssetType() {
  const { t } = useTranslation();
  const typeAssetMap: TypeAssetMap = {
    0: { name: t('status.all') },
    1: { name: t('asset.motorcycle') },
    2: { name: t('asset.truck') },
    3: { name: t('agent.oto') },
  };
  const typeAssetFilter: TypeAsset[] = [
    { id: 1, name: t('asset.motorcycle') },
    { id: 2, name: t('asset.truck') },
    { id: 3, name: t('agent.oto') },
  ];
  return { typeAssetMap, typeAssetFilter };
}
