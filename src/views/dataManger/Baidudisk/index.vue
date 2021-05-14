<!--
 * @Autor: luowy
 * @Date: 2020-11-25 17:44:45
 * @LastEditors: luowy
 * @LastEditTime: 2021-03-02 16:22:51
 * @Description:
-->
<template>
  <div class="mian">
    <div class="left">
      <RegisterGroupTree />
    </div>
    <div class="right">
      <NetworkGroupTree />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import RegisterGroupTree from './RegisterGroupTree.vue';
  import NetworkGroupTree from './NetworkGroupTree.vue';
  export default defineComponent({
    name: 'Baidudisk',
    components: { RegisterGroupTree, NetworkGroupTree },
  });
</script>
<style lang="less" scoped>
  .mian {
    display: flex;
    width: 100%;
    height: calc(100% - 3rem);
    justify-content: center;
    align-items: center;

    .spin-plan {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .left {
      float: left;
      width: 50%;
      height: 100%;
      border-right: 2px solid #f0f2f5;
    }

    .right {
      float: left;
      width: 50%;
      height: 100%;
    }
  }
</style>
