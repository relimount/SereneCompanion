<template>
      <el-menu
        :style = "{ width : menuWidth }"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        :collapse="sidebarStore.isCollapse"
      >
        <h2 class="title">{{ sidebarStore.isCollapse ? 'DIDI' : 'DIDI陪诊' }}</h2>
        <treeMenu :menuData="menuData" :index="1"></treeMenu>
      </el-menu>
</template>

<script setup>
import {  computed } from 'vue'

import treeMenu from './treeMenu.vue'

import { useSidebarStore } from '@/store/sidebar'

const sidebarStore = useSidebarStore()
const menuWidth = computed(() => {
  return sidebarStore.isCollapse ? '60px' : '230px'
})

const menuData = computed(() => {
  return useSidebarStore().routerList
})
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo {
  height: 100%;
  .title {
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}
</style>
