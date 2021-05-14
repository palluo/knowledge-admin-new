/*
 * @Autor: luowy
 * @Date: 2020-11-25 15:04:13
 * @LastEditors: luowy
 * @LastEditTime: 2021-03-02 21:39:57
 * @Description:
 */
import { defHttp } from '/@/utils/http/axios';
import { NetdiskInfo, TreeNode, NetworkTreeNode } from './model/baiduNetdiskModel';

enum Api {
  LoginByCookies = '/baiduNetdisk/loginByCookies',
  GetShareGroups = '/baiduNetdisk/getShareGroups',
  GetRegisterNetdiskList = '/dataBaseOperation/getRegisterNetdiskList',
  GetTreeNodeByParentId = '/dataBaseOperation/getTreeNodeByParentId',
  GetFirstListByShareGroupId = '/baiduNetdisk/getFirstListByShareGroupId',
  GetNetdiskNodeDataByParam = '/baiduNetdisk/getNetdiskNodeDataByParam',
  ExportData = '/baiduNetdisk/exportData',
  GetExportDataStatus = '/dataBaseOperation/getExportDataStatus',
  DeleteNetdiskData = '/dataBaseOperation/deleteNetdiskData',
  GetTreeLeftByParentId = '/dataBaseOperation/getTreeLeftByParentId',
  RegisterNetdisk = '/dataBaseOperation/registerNetdisk',
}

/**
 * @description: 使用系统配置的网盘cookie登录网盘
 */
export function loginByCookies() {
  return defHttp.request<boolean>(
    {
      url: Api.LoginByCookies,
      method: 'POST',
      timeout: 300000,
    },
    {
      errorMessageMode: 'modal',
    }
  );
}
/**
 * 获取当前网盘具有的分享群
 */
export function getShareGroups() {
  return defHttp.request<Array<any>>(
    {
      url: Api.GetShareGroups,
      method: 'GET',
    },
    {
      errorMessageMode: 'modal',
    }
  );
}

export function getRegisterNetdiskList() {
  return defHttp.request<Array<NetdiskInfo>>(
    {
      url: Api.GetRegisterNetdiskList,
      method: 'GET',
    },
    {
      errorMessageMode: 'modal',
    }
  );
}
/**
 * 获取下一节点的tree
 * @param tableName 表的名称
 * @param parentId 节点id
 */
export function getTreeNodeByParentId(tableName: string, parentId: string) {
  return defHttp.request<Array<TreeNode>>(
    {
      url: `${Api.GetTreeNodeByParentId}?tableName=${tableName}&parentId=${parentId}`,
      method: 'GET',
    },
    {
      errorMessageMode: 'modal',
    }
  );
}
/**
 * 通过分享群id获取对应的数据
 * @param gid 分享群id
 * @param isFilterSome 是否相同
 */
export function getFirstListByShareGroupId(gid: string, isFilterSome: boolean) {
  return defHttp.request<Array<NetworkTreeNode>>(
    {
      url: `${Api.GetFirstListByShareGroupId}?gid=${gid}&isFilterSome=${isFilterSome}`,
      method: 'GET',
    },
    {
      errorMessageMode: 'modal',
    }
  );
}

/**
 * 通过分享群id获取对应的数据
 * @param gid 分享群id
 * @param isFilterSome 是否相同
 */
export function getNetdiskNodeDataByParam(
  gid: string,
  msgId: string,
  fromUk: string,
  fsId: string | null,
  toUk: string | null
) {
  let url = `${Api.GetNetdiskNodeDataByParam}?gid=${gid}&msgId=${msgId}&fromUk=${fromUk}`;
  if (fsId) {
    url += `&fsId=${fsId}`;
  }
  if (toUk) {
    url += `&toUk=${toUk}`;
  }
  return defHttp.request<Array<NetworkTreeNode>>(
    {
      url: url,
      method: 'GET',
    },
    {
      errorMessageMode: 'modal',
    }
  );
}
/**
 * 入库某个文件夹列表数据
 * @param shareGroupId 分享
 * @param parentId  父节点id
 * @param name 文件夹名称
 * @param msgId
 * @param fromUk
 * @param fsId
 * @param toUk
 */
export function exportData(
  shareGroupId: string,
  parentId: string,
  name: string,
  msgId: string,
  fromUk: string,
  fsId: string | null,
  toUk: string | null
) {
  let url = `${Api.ExportData}?shareGroupId=${shareGroupId}&parentId=${parentId}&name=${name}&msgId=${msgId}&fromUk=${fromUk}`;
  if (fsId) {
    url += `&fsId=${fsId}`;
  }
  if (toUk) {
    url += `&toUk=${toUk}`;
  }
  return defHttp.request<any>(
    {
      url: url,
      method: 'PUT',
    },
    {
      errorMessageMode: 'modal',
    }
  );
}
/**
 * 通过分享群id获取对应的数据
 * @param taskid 任务id
 */
export function getExportDataStatus(taskid: string) {
  return defHttp.request<Array<NetworkTreeNode>>(
    {
      url: `${Api.GetExportDataStatus}?taskId=${taskid}`,
      method: 'GET',
    },
    {
      errorMessageMode: 'modal',
    }
  );
}
/**
 * 清除网盘里面的所有数据或者单个文件夹的内容数据
 * @param taskid 任务id
 */
export function deleteNetdiskData(shareGroupId: string, fsId: string) {
  return defHttp.request<any>(
    {
      url: `${Api.DeleteNetdiskData}?shareGroupId=${shareGroupId}&fsId=${fsId}`,
      method: 'DELETE',
    },
    {
      errorMessageMode: 'modal',
    }
  );
}
/**
 * 获取叶子节点数据
 * @param parentId 父节点id
 * @param tableName 主表名称
 * @param type 数据类型（1 是视频，2 是音频，3是其他）
 */
export function getTreeLeftByParentId(parentId: string, tableName: string, type: string) {
  return defHttp.request<any>(
    {
      url: `${Api.GetTreeLeftByParentId}?parentId=${parentId}&tableName=${tableName}&type=${type}`,
      method: 'GET',
    },
    {
      errorMessageMode: 'modal',
    }
  );
}

/**
 * 注册数据库
 * @param shareGroupName  分享群名称
 * @param gid  群gid
 * @param tableName  对应的自定义数据库主表名称，必须是小写英文（例如：it）
 */
export function registerNetdisk(shareGroupName: string, gid: string, tableName: string) {
  return defHttp.request<any>(
    {
      url: `${Api.RegisterNetdisk}?shareGroupName=${shareGroupName}&gid=${gid}&tableName=${tableName}`,
      method: 'PUT',
    },
    {
      errorMessageMode: 'modal',
    }
  );
}
