<!--
 * @Autor: luowy
 * @Date: 2020-11-25 17:44:45
 * @LastEditors: luowy
 * @LastEditTime: 2021-03-02 22:55:00
 * @Description:
-->
<template>
  <div class="title"
    >已经入库
    <a-button type="primary" class="button-refresh" @click="refreshTree"> 刷 新</a-button>
  </div>
  <div class="plan">
    <BasicMenu
      v-if="registerMenu.length > 0"
      class="register-list-items"
      @menuClick="handleMenuClick"
      :selectedKeys="selectedKeys"
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
  </div>
</template>
<script lang="ts">
  import { defineComponent, onBeforeMount, reactive, toRefs, unref, ref, h } from 'vue';
  import { BasicTree, TreeActionType, ActionItem } from '/@/components/Tree/index';
  import {
    getRegisterNetdiskList,
    getTreeNodeByParentId,
    deleteNetdiskData,
    getTreeLeftByParentId,
  } from '/@/api/sys/baiduNetdisk';
  import { NetdiskInfo } from '/@/api/sys/model/baiduNetdiskModel';
  import { BasicMenu } from '/@/components/Menu/index';
  import { TreeItem } from '/@/components/Tree/src/types';
  import type { Menu } from '/@/router/types';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import { TreeNode } from '/@/api/sys/model/baiduNetdiskModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'RegisterGroupTree',
    components: { BasicTree, BasicMenu },
    setup() {
      const { createMessage } = useMessage();
      const treeRef = ref<Nullable<TreeActionType>>(null);
      function getTree() {
        const tree = unref(treeRef);
        // if (!tree) {
        //   throw new Error('tree is null!');
        // }
        return tree;
      }
      interface Data {
        treeData: TreeItem[];
        registerMenu: Menu[];
        tipMessage: String;
        tableName: string;
        loadedKeys: string[];
        selectedKeys: string[];
      }
      const data: Data = reactive({
        treeData: [],
        registerMenu: [],
        tipMessage: '',
        tableName: '',
        loadedKeys: [],
        selectedKeys: [],
      });
      onBeforeMount(() => {
        createMenu();
      });
      /**
       * 创建菜单栏
       */
      async function createMenu() {
        data.registerMenu = [];
        const netdiskInfo: NetdiskInfo[] = await getRegisterNetdiskList();
        netdiskInfo.forEach((item, index) => {
          let obj: Menu = {
            name: item.share_group_name,
            path: item.table_name,
            data: item,
            // icon: 'ant-design:cloud',
          };
          if (index === 0) {
            data.selectedKeys.push(item.table_name);
            handleMenuClick(item.table_name);
          }
          data.registerMenu.push(obj);
        });
      }
      /**
       * 异步加载树
       */
      const onTreeLoadData = (treeNode: any) => {
        return new Promise(async (resolve) => {
          if (treeNode.dataRef && treeNode.dataRef.children) {
            resolve(null);
            return;
          }
          const nodeData = treeNode.$attrs.data;
          if (nodeData && data.tableName.length > 0) {
            const treeNodeChildren: Array<any> = [];
            // treeNode.dataRef.children = [];
            await setTreeData(data.tableName, nodeData.id, treeNodeChildren);
            resolve(null);
            treeNodeChildren.forEach((item: any) => {
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
            });
            if (treeNodeChildren.length == 1 && treeNodeChildren[0].key == '看详情面板') {
              handlerLeaf(treeNode.eventKey);
            }
          }
        });
      };

      async function handlerLeaf(parentid) {
        const response = await getTreeLeftByParentId(parentid, data.tableName, '1');
        console.log(response);
      }
      /**
       * 刷新当前tree
       */
      const refreshTree = () => {
        createMenu();
      };
      const actionList: ActionItem[] = [
        {
          render: (node) => {
            return h(DeleteOutlined, {
              class: 'ml-2',
              onClick: () => {
                deleteFolder(node);
              },
            });
          },
        },
      ];
      async function deleteFolder(node: any) {
        const treeData: TreeNode = node.data;
        const response = await deleteNetdiskData(treeData.share_group_id, treeData.id);
        if (response) {
          const tree: any = getTree();
          if (tree) {
            tree.deleteNodeByKey(node.key);
            createMessage.success('删除成功！');
          }
        }
      }
      const loginNetworkDisk = () => {};
      const handleMenuClick = async (tableName: string) => {
        data.loadedKeys = [];
        data.treeData = [];
        data.tableName = tableName;
        setTreeData(tableName, '-1', data.treeData);
      };

      const setTreeData = async (tableName: string, parentId: string, arrParent: any[]) => {
        const nodeData: any[] = await getTreeNodeByParentId(tableName, parentId);
        nodeData.forEach((item) => {
          const objItem = {
            title: item.name,
            key: item.id,
            data: item,
          };
          arrParent.push(objItem);
        });
        if (arrParent.length == 0) {
          arrParent.push({
            title: '看详情面板',
            key: '看详情面板',
            data: '看详情面板',
            isLeaf: true,
          });
        }
      };
      return {
        ...toRefs(data),
        treeRef,
        onTreeLoadData,
        loginNetworkDisk,
        handleMenuClick,
        actionList,
        refreshTree,
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

  .button-refresh {
    float: right;
    margin-top: 7px;
    margin-right: 10px;
  }
</style>
