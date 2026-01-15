<template>
        <template v-for="(item,index) in props.menuData">
          <el-menu-item 
          v-if = "!item.children || item.children.length === 0"
          :index="`${props.index} - ${item.meta.id}`"
          :key="`${props.index} - ${item.meta.id}`"
          @click="handleClick(item,`${props.index} - ${item.meta.id}`)"
          >
            <el-icon :size="20">
              <component :is="item.meta.icon" />
            </el-icon>
            <span>{{ item.meta.name }}</span>
          </el-menu-item>
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
  router.push(item.meta.path)
  const addMenuStore = useAddMenuStore()
  addMenuStore.addMenu(item)
}
</script>
