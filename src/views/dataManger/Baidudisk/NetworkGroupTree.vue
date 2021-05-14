<!--
 * @Autor: luowy
 * @Date: 2020-11-25 17:44:45
 * @LastEditors: luowy
 * @LastEditTime: 2021-05-14 17:26:53
 * @Description:
-->
<template>
  <div class="title">网盘数据</div>
  <div class="plan">
    <BasicMenu
      v-if="registerMenu.length > 0"
      class="register-list-items"
      @menuClick="handleMenuClick"
      :items="registerMenu"
      :theme="'light'"
    />
    <BasicTree
      class="register-tree"
      :treeData="treeData"
      :loadData="onTreeLoadData"
      :loadedKeys="loadedKeys"
      :actionList="actionList"
      ref="treeRef"
    />
    <BasicModal title="提示" @register="registerModal" @ok="handlerStartRegister">
      {{ registerMessage }}
    </BasicModal>
    <BasicModal title="注册数据库" @register="registerModal1" @ok="handlerRegisterDataBase">
      <Input v-model:value="currRegisterTableName" placeholder="主表名称，小写英文（例如：it）" />
    </BasicModal>
    <Loading :loading="isLoad" :tip="tipMessage" :absolute="true" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, h, onBeforeMount, reactive, toRefs, ref, unref } from 'vue';
  import { BasicTree, ActionItem, TreeActionType } from '/@/components/Tree/index';
  import { baiduNetdiskStore } from '/@/store/modules/baiduNetdisk';
  import {
    getShareGroups,
    getFirstListByShareGroupId,
    getNetdiskNodeDataByParam,
    exportData,
    getExportDataStatus,
    registerNetdisk,
  } from '/@/api/sys/baiduNetdisk';
  import { NetworkTreeNode } from '/@/api/sys/model/baiduNetdiskModel';
  import { BasicMenu } from '/@/components/Menu/index';
  import { TreeItem } from '/@/components/Tree/src/types';
  import type { Menu } from '/@/router/types';
  import { CloudDownloadOutlined } from '@ant-design/icons-vue';
  import { Loading } from '/@/components/Loading';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Input } from 'ant-design-vue';
  export default defineComponent({
    name: 'NetworkGroupTree',
    components: { BasicTree, BasicMenu, Loading, BasicModal, Input },
    setup() {
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const { createMessage } = useMessage();
      const [registerModal, { openModal: openRegisterModal }] = useModal();
      const [registerModal1, { openModal: openRegisterModal1 }] = useModal();
      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          console.log('tree is null!');
        }
        return tree;
      }
      const isLogin = baiduNetdiskStore.getIsLogin;
      interface Data {
        isLogin: boolean;
        treeData: TreeItem[];
        registerMenu: Menu[];
        tipMessage: string;
        isLoad: boolean;
        shareGroupData: NetworkTreeNode | null;
        loadedKeys: string[];
        registerMessage: string;
        currRegisterData: NetworkTreeNode | null;
        currRegisterTaskId: string;
        currRegisterTableName: string;
      }
      const data: Data = reactive({
        isLogin: isLogin,
        treeData: [],
        registerMenu: [],
        tipMessage: '',
        isLoad: false,
        shareGroupData: null,
        loadedKeys: [],
        registerMessage: '',
        currRegisterData: null,
        currRegisterTaskId: '',
        currRegisterTableName: '',
      });
      onBeforeMount(async () => {
        if (!isLogin) {
          data.tipMessage = '正在登录网盘。。。';
          data.isLoad = true;
          const bool = await baiduNetdiskStore.login();
          if (bool) {
            data.isLoad = !bool;
          }
        }
        const netdiskInfo: any[] = await getShareGroups();
        netdiskInfo.forEach((item) => {
          let obj: Menu = {
            name: item.name,
            path: item.gid,
            data: item,
            // icon: 'ant-design:cloud',
          };
          data.registerMenu.push(obj);
        });
      });
      /**
       * 异步加载树
       */
      const onTreeLoadData = (treeNode: any) => {
        return new Promise(async (resolve) => {
          if (treeNode.dataRef && treeNode.dataRef.children) {
            resolve(null);
            return;
          }
          const nodeData: NetworkTreeNode = treeNode.$attrs.data;
          if (nodeData) {
            const treeNodeChildren = [];
            await setTreeData(
              nodeData.type == 'zip' ? null : nodeData.fsid,
              nodeData.msgId,
              nodeData.fromUk,
              treeNodeChildren
            );
            resolve(null);
            treeNodeChildren.forEach((item: any) => {
              if (item.key != treeNode.eventKey) {
                item.data.parentId = treeNode.eventKey;
                const tree: any = getTree();
                if (tree) {
                  tree.insertNodeByKey({
                    parentKey: treeNode.eventKey,
                    node: item,
                    // 往后插入
                    push: 'push',
                    // 往前插入
                    // push:'unshift'
                  });
                }
              }
            });
          }
        });
      };
      const actionList: ActionItem[] = [
        {
          render: (node) => {
            return h(CloudDownloadOutlined, {
              class: 'ml-2',
              onClick: () => {
                registerNetworkDisk(node);
              },
            });
          },
        },
      ];
      function registerNetworkDisk(node: any) {
        if (node.data) {
          data.registerMessage = `确定入库“${node.data.name}”该文件夹及下面所有文件？`;
          data.currRegisterData = node.data;
          // console.log(node);
          openRegisterModal(true);
        }
      }
      /**
       * 查询入库任务状态
       */
      function setTimeGetTaskStatus(taskid: string) {
        const timeId = setInterval(async () => {
          const response: any = await getExportDataStatus(taskid);
          if (response.state == 1) {
            clearTimeout(timeId);
            data.isLoad = false;
          }
        }, 1000);
      }
      /**
       * 把分享群注册到数据库
       */
      const handlerRegisterDataBase = async () => {
        if (data.currRegisterTableName.length > 0) {
          if (data.shareGroupData) {
            const response = await registerNetdisk(
              data.shareGroupData.name,
              data.shareGroupData.gid,
              data.currRegisterTableName
            );
            openRegisterModal1(false);
            if (response) {
              createMessage.success('注册成功！');
            } else {
              createMessage.error('注册错误！');
            }
          }
        } else {
          createMessage.warn('请先输入表名称！');
        }
      };
      /**
       * 入库某个文件夹
       */
      const handlerStartRegister = async () => {
        const currRegisterData = <NetworkTreeNode>data.currRegisterData;
        const gid = <string>data.shareGroupData?.gid;
        if (currRegisterData) {
          data.tipMessage = '入库中！。。。';
          const parentId: string = currRegisterData.parentId ? currRegisterData.parentId : '-1';
          openRegisterModal(false);
          let response: any = await exportData(
            gid,
            parentId,
            currRegisterData?.name,
            currRegisterData?.msgId,
            currRegisterData?.fromUk,
            currRegisterData.fsid,
            currRegisterData?.toUk
          );
          if (response.code == -1) {
            // 还没注册该分享群
            createMessage.info('该分享群还没注册数据库，请先注册数据库！');
            openRegisterModal1(true);
          } else {
            data.currRegisterTaskId = response.taskId;
            data.isLoad = true;
            setTimeGetTaskStatus(response.taskId);
          }

          // console.log(response);
        }
      };

      const handleMenuClick = async (key: string) => {
        const item: Menu = <Menu>data.registerMenu.find((item) => item.path === key);
        data.shareGroupData = item.data;
        data.loadedKeys = [];
        data.treeData = [];
        data.shareGroupData = item.data;
        const response: Array<NetworkTreeNode> = await getFirstListByShareGroupId(
          item.data.gid,
          true
        );
        response.forEach((item) => {
          const objItem = {
            title: item.name,
            key: item.fsid,
            data: item,
          };
          data.treeData.push(objItem);
        });
      };

      const setTreeData = async (
        fsId: string | null,
        msgId: string,
        fromUk: string,
        arrParent: any[]
      ) => {
        const { gid, toUk } = { ...data.shareGroupData };
        const nodeData: Array<NetworkTreeNode> = await getNetdiskNodeDataByParam(
          <string>gid,
          msgId,
          fromUk,
          fsId,
          <string>toUk
        );
        nodeData.forEach((item) => {
          const objItem = {
            title: item.name,
            key: item.fsid,
            isLeaf: item.isdir == 1 ? false : true,
            data: item,
          };
          arrParent.push(objItem);
        });
        if (arrParent.length == 0) {
          arrParent.push({
            title: '无',
            key: '无',
            data: {},
            isLeaf: true,
          });
        }
      };
      return {
        ...toRefs(data),
        registerModal,
        registerModal1,
        handlerStartRegister,
        treeRef,
        onTreeLoadData,
        handleMenuClick,
        actionList,
        handlerRegisterDataBase,
      };
    },
  });
</script>
<style lang="less" scoped>
  .title {
    width: 100%;
    height: 3rem;
    font-weight: bold;
    line-height: 3rem;
    text-align: center;
    background-color: #fff;
    border-bottom: 2px solid #f0f2f5;
  }

  .plan {
    position: relative;
    width: 100%;
    height: 100%;

    .spin-plan {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .register-list-items {
      float: left;
      width: 10rem;
      height: 100%;
      background-color: #fff;
    }

    .register-tree {
      float: left;
      width: calc(100% - 10rem);
      height: 100%;
      overflow-y: auto;
    }

    .spin {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  }
</style>
