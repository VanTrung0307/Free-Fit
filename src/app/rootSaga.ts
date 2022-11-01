import adminLevelSaga from 'features/admin-level/adminLevelSaga';
import agentSaga from 'features/agent/agentSaga';
import authSaga from 'features/auth/authSaga';
import groupZoneSaga from 'features/group-zone/groupZoneSaga';
import assetSaga from 'features/manage-assets/assetSaga';
import orderSaga from 'features/order/orderSaga';
import poiBrandsSaga from 'features/pois-brand/poiBrandSaga';
import poiSaga from 'features/pois/poiSaga';
import storeSaga from 'features/store-management/storeSaga';
import brandSaga from 'features/brand-management/brandSaga';
import segmentSaga from 'features/segment-management/segmentSaga';
import storeTypeSaga from 'features/storetype-management/storeTypeSaga';
import accountSaga from 'features/account-management/accountSaga';
import taskSaga from 'features/task/taskSaga';
import teamSaga from 'features/team/teamSaga';
import tzVersionSaga from 'features/trade-zone-version/tzVersionSaga';
import tradeZoneSaga from 'features/trade-zone/tradeZoneSaga';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    authSaga(),
    storeSaga(),
    poiSaga(),
    adminLevelSaga(),
    poiBrandsSaga(),
    assetSaga(),
    groupZoneSaga(),
    tzVersionSaga(),
    tradeZoneSaga(),
    teamSaga(),
    agentSaga(),
    orderSaga(),
    taskSaga(),
    brandSaga(),
    accountSaga(),
    segmentSaga(),
    storeTypeSaga(),
  ]);
}
