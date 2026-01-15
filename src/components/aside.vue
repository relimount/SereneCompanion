<template>
      <el-menu
        :style = "{ width : menuWidth }"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        :default-active="getDefaultActive()"
        text-color="#fff"
        :collapse="sidebarStore.isCollapse"
      >
        <h2 class="title">{{ sidebarStore.isCollapse ? 'DIDI' : 'DIDI陪诊' }}</h2>
        <treeMenu :menuData="menuData" :index="1"></treeMenu>
      </el-menu>
</template>

<script setup>
import {  computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import treeMenu from './treeMenu.vue'

import { useSidebarStore } from '@/store/sidebar'

const sidebarStore = useSidebarStore()
const router = useRouter()

// 计算菜单数据
const menuData = computed(() => {
  // 添加调试日志，查看菜单数据结构
  console.log('菜单数据:', sidebarStore.routerList)
  return sidebarStore.routerList
})

// 计算菜单宽度
const menuWidth = computed(() => {
  return sidebarStore.isCollapse ? '60px' : '230px'
})

// 获取当前激活的菜单ID
const getDefaultActive = () => {
  const currentPath = router.currentRoute.value.path
  return findMenuIndex(sidebarStore.routerList, currentPath)
}

// 递归查找菜单索引
const findMenuIndex = (menus, path, parentIndex = 1) => {
  for (const menu of menus) {
    // 如果当前菜单的路径匹配，返回其索引
    if (menu.meta?.path === path) {
      return `${parentIndex} - ${menu.meta.id}`
    }
    
    // 如果有子菜单，递归查找
    if (Array.isArray(menu.children) && menu.children.length > 0) {
      const foundIndex = findMenuIndex(menu.children, path, `${parentIndex} - ${menu.meta.id}`)
      if (foundIndex) {
        return foundIndex
      }
    }
  }
  
  // 未找到匹配的菜单，返回默认值
  return ''
}

onMounted(() => {
  // 在组件挂载后检查菜单数据
  console.log('挂载时的菜单数据:', sidebarStore.routerList)
  
  // 初始化激活菜单
  sidebarStore.updateActiveMenu()
})
</script>

<style lang="scss" scoped>
.title {
  color: #fff;
  text-align: center;
  padding: 10px 0;
}
</style>