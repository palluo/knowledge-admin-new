/*
 * @Autor: luowy
 * @Date: 2021-02-22 09:45:18
 * @LastEditors: luowy
 * @LastEditTime: 2021-03-01 16:54:56
 * @Description:
 */
import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dataManger: AppRouteModule = {
  path: '/dataManger',
  name: 'dataManger',
  component: LAYOUT,
  redirect: '/dataManger/baidudisk',
  meta: {
    icon: 'bx:bx-home',
    title: t('routes.dashboard.dataManger'),
  },
  children: [
    {
      path: 'baidudisk',
      name: 'baidudisk',
      component: () => import('/@/views/dataManger/Baidudisk/index.vue'),
      meta: {
        title: t('routes.dashboard.baidudisk'),
        affix: true,
        icon: 'bx:bx-home',
      },
    },
  ],
};

export default dataManger;
