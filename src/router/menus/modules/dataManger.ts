/*
 * @Autor: luowy
 * @Date: 2020-11-25 15:04:13
 * @LastEditors: luowy
 * @LastEditTime: 2021-03-01 17:00:17
 * @Description:
 */
import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
const menu: MenuModule = {
  orderNo: 2,
  menu: {
    path: '/dataManger',
    name: t('routes.dashboard.dataManger'),
    children: [
      {
        path: '/baidudisk',
        name: t('routes.dashboard.baidudisk'),
      },
    ],
  },
};
export default menu;
