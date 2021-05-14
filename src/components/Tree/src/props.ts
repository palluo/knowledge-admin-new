/*
 * @Autor: luowy
 * @Date: 2021-02-20 16:00:14
 * @LastEditors: luowy
 * @LastEditTime: 2021-02-20 17:19:34
 * @Description:
 */
import { PropType } from 'vue';
import type { ReplaceFields, TreeItem, ActionItem, Keys, CheckKeys } from './types';
import type { ContextMenuItem } from '/@/hooks/web/useContextMenu';

export const basicProps = {
  replaceFields: {
    type: Object as PropType<ReplaceFields>,
  },

  treeData: {
    type: Array as PropType<TreeItem[]>,
  },

  actionList: {
    type: Array as PropType<ActionItem[]>,
    default: () => [],
  },

  expandedKeys: {
    type: Array as PropType<Keys>,
    default: () => [],
  },

  selectedKeys: {
    type: Array as PropType<Keys>,
    default: () => [],
  },

  checkedKeys: {
    type: Array as PropType<CheckKeys>,
    default: () => [],
  },

  beforeRightClick: {
    type: Function as PropType<(...arg: any) => ContextMenuItem[]>,
    default: null,
  },

  rightMenuList: {
    type: Array as PropType<ContextMenuItem[]>,
  },
  loadData: {
    type: Function,
    default: null,
  },
};

export const treeNodeProps = {
  actionList: {
    type: Array as PropType<ActionItem[]>,
    default: () => [],
  },
  replaceFields: {
    type: Object as PropType<ReplaceFields>,
  },
  treeData: {
    type: Array as PropType<TreeItem[]>,
    default: () => [],
  },
};
