/*
 * @Autor: luowy
 * @Date: 2021-02-20 16:00:14
 * @LastEditors: luowy
 * @LastEditTime: 2021-02-22 12:56:40
 * @Description:
 */
import { userStore, UserInfo } from '/@/store/modules/user';

/**
 * @description:  Get token
 * @return jwt token
 */
export function getToken(): string {
  return userStore.getTokenState;
}
export function getUser(): UserInfo {
  return userStore.getUserInfoState;
}
export function getUserId(): string {
  return userStore.getUserInfoState?.id;
}
