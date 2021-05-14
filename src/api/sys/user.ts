/*
 * @Autor: luowy
 * @Date: 2021-02-20 16:00:13
 * @LastEditors: luowy
 * @LastEditTime: 2021-02-20 16:54:37
 * @Description:
 */
import { defHttp } from '/@/utils/http/axios';
import { LoginParams, GetUserInfoByUserIdModel } from './model/userModel';

enum Api {
  GetPublicKey = '/user/getPublicKey',
  Login = '/user/login',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams) {
  return defHttp.request<GetUserInfoByUserIdModel>(
    {
      url: Api.Login,
      method: 'POST',
      params,
    },
    {
      errorMessageMode: 'modal',
    }
  );
}

export function getPublicKey() {
  return defHttp.request({
    url: Api.GetPublicKey,
    method: 'GET',
  });
}
