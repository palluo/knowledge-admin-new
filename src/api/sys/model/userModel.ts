/*
 * @Autor: luowy
 * @Date: 2021-02-20 16:00:13
 * @LastEditors: luowy
 * @LastEditTime: 2021-02-22 13:03:29
 * @Description:
 */
/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  name: string;
  password: string;
}

/**
 * @description: Get user information
 */
export interface GetUserInfoByUserIdParams {
  userId: string | number;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */

export interface GetUserInfoByUserIdModel {
  role: RoleInfo;
  // 用户id
  id: string;
  // 用户名
  name: string;
  // 真实名字
  nickname: string;
  // 介绍
  desc?: string;
}
