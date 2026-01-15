<template>
        <template v-for="(item,index) in props.menuData">
          <!-- 无子菜单的菜单项 -->
          <el-menu-item 
          v-if = "!item.children || (Array.isArray(item.children) && item.children.length === 0)"
          :index="`${props.index} - ${item.meta.id}`"
          :key="`${props.index} - ${item.meta.id}`"
          @click="handleClick(item,`${props.index} - ${item.meta.id}`)"
          >
            <el-icon :size="20">
              <component :is="item.meta.icon" />
            </el-icon>
            <span>{{ item.meta.name }}</span>
          </el-menu-item>
          <!-- 有子菜单的菜单项 -->
          <el-sub-menu
          v-else
          :index="`${props.index} - ${item.meta.id}`"
          >
            <template #title>
              <el-icon :size="20">
                <component :is="item.meta.icon" />
              </el-icon>
              <span>{{ item.meta.name }}</span>
            </template>
            <treeMenu :menuData="item.children" :index="`${props.index} - ${item.meta.id}`"></treeMenu>
          </el-sub-menu>
        </template>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { useAddMenuStore } from '@/store/addmenu'
  const router = useRouter()
const props = defineProps({
  menuData: {
    type: Array,
    default: () => []
  },
  index: {
    type: [Number, String], // 允许index接受数字或字符串类型
    default: 0
  }
})

const handleClick = (item, index) => {
  // 添加调试日志
  console.log('点击的菜单:', item)
  console.log('菜单是否有子菜单:', Array.isArray(item.children) && item.children.length > 0)
  console.log('菜单路径:', item.meta.path)
  
  // 确保菜单数据结构一致
  const menuData = {
    ...item,
    children: Array.isArray(item.children) ? item.children : []
  }
  
  // 如果有路径，导航到对应页面
  if (item.meta && item.meta.path) {
    router.push(item.meta.path)
  }
  
  // 创建addMenuStore实例
  const addMenuStore = useAddMenuStore()
  
  // 添加菜单到导航栏
  const result = addMenuStore.addMenu(menuData)
  console.log('添加菜单结果:', result)
  console.log('当前已选菜单:', addMenuStore.selectedMenu)
}
</script>
