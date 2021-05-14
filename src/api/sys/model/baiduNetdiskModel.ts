/*
 * @Autor: luowy
 * @Date: 2020-11-25 15:04:13
 * @LastEditors: luowy
 * @LastEditTime: 2021-03-02 14:23:11
 * @Description:
 */
export interface NetdiskInfo {
  id: string;
  share_group_name: string;
  create_time: string;
  table_name: string;
}

export interface TreeNode {
  id: string;
  name: string;
  parent_id: string;
  share_group_id: string;
  path: string;
  size: number;
  server_time: Date;
  create_time: Date;
  msg_id: string;
  from_uk: string;
  to_uk: string;
}

export interface NetworkTreeNode {
  parentId: string;
  name: string;
  fsid: string;
  isdir: number;
  gid: string;
  fromUk: string;
  msgId: string;
  toUk: string;
  type: string | null;
}
