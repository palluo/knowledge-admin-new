/*
 * @Autor: luowy
 * @Date: 2021-01-15 09:52:51
 * @LastEditors: luowy
 * @LastEditTime: 2021-02-20 16:45:28
 * @Description:
 */
import { loginByCookies } from '/@/api/sys/baiduNetdisk';
import store from '/@/store/index';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { NetdiskInfo } from '/@/api/sys/model/baiduNetdiskModel';
const NAME = 'baiduNetdisk';
@Module({ namespaced: true, name: NAME, dynamic: true, store })
class BaiduNetdisk extends VuexModule {
  // 网盘是否登录
  private isLogin = false;
  // 已经注册到数据库中的分享群
  private registerNetdiskList: Array<NetdiskInfo> = [];
  // 全部的分享群
  private allShareGroupList: Array<NetdiskInfo> = [];

  get getIsLogin(): boolean {
    return this.isLogin;
  }
  get getRegisterNetdiskList(): Array<NetdiskInfo> {
    return this.registerNetdiskList;
  }
  get getAllShareGroupListData(): Array<NetdiskInfo> {
    return this.allShareGroupList;
  }
  @Mutation
  commitIsLogin(bool: boolean) {
    if (bool) {
      this.isLogin = bool;
    }
  }
  /**
   * 登录百度网盘
   */
  @Action
  async login(): Promise<boolean> {
    let bool = false;
    try {
      bool = await loginByCookies();
    } catch (error) {
      bool = false;
    }
    this.commitIsLogin(bool);
    return bool;
  }
  /**
   * 根据名称获取已经注册的群
   * @param name 群名称
   */
  getRegisterNetdisk(name: String): NetdiskInfo | null {
    let obj: NetdiskInfo | null = null;
    if (this.registerNetdiskList && this.registerNetdiskList.length > 0) {
      this.registerNetdiskList.forEach((item) => {
        if (item.share_group_name == name) {
          obj = item;
        }
      });
    }
    return obj;
  }
}
export { BaiduNetdisk };
export const baiduNetdiskStore = getModule<BaiduNetdisk>(BaiduNetdisk);
