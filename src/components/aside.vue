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
import {  computed, onMounted } from 'vue'

import treeMenu from './treeMenu.vue'

import { useSidebarStore } from '@/store/sidebar'

const sidebarStore = useSidebarStore()

const menuData = computed(() => {
  // 添加调试日志，查看菜单数据结构
  console.log('菜单数据:', sidebarStore.routerList)
  return sidebarStore.routerList
})

// 计算菜单宽度
const menuWidth = computed(() => {
  return sidebarStore.isCollapse ? '60px' : '230px'
})

onMounted(() => {
  // 在组件挂载后检查菜单数据
  console.log('挂载时的菜单数据:', sidebarStore.routerList)
})
</script>

<style lang="scss" scoped>
.title {
  color: #fff;
  text-align: center;
  padding: 10px 0;
}
</style>