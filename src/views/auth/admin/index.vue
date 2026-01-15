<template>
  <div>
    <h1>账号管理</h1>
  </div>
</template>

<script setup>
import { authAdmin } from '@/api/index'
import { reactive,onMounted } from 'vue'

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
})

onMounted(() => {
  authAdmin(paginationData).then(({ data }) => {
    console.log(data)
  }).catch(error => {
    console.error('获取账号数据失败:', error)
  })
})

</script>

<style scoped>

</style>
