<template>
      <el-menu
        :style = "{ width : '230px'}"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
      >
        <h2 class="title">安心伴</h2>
        <treeMenu :menuData="menuData" :index="1"></treeMenu>
      </el-menu>
</template>

<script setup>
import { ref, reactive } from 'vue'

import treeMenu from './treeMenu.vue'

import { useRouter } from 'vue-router'

const router = useRouter()
const menuData = reactive(router.options.routes[0].children)

const isCollapse = ref(true)

const handleOpen = (key) => {
  if (key === '1') {
    isCollapse.value = false
  } else {
    isCollapse.value = true
  }
}

const handleClose = (key) => {
  if (key === '1') {
    isCollapse.value = false
  } else {
    isCollapse.value = true
  }
}


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
