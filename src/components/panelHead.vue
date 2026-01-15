<template>
  <div class="panel-heading">
    <div class="panel-lead">
      <div class="title">{{ title }}</div>
      <p class="description">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
  // 定义组件的props，支持自定义标题和描述
  const props = defineProps({
    // 标题，默认为"菜单管理"
    title: {
      type: String,
      default: '菜单管理'
    },
    // 描述，默认为原来的内容
    description: {
      type: String,
      default: '菜单规则通常对应一个控制器的方法，同时菜单栏数据也从规则中获取'
    }
  })
</script>

<style lang="scss" scoped>
.panel-heading {
  padding: 15px;
  background: #e8edf0;
  border-color: #e8edf0;
  position: relative;
  
  .panel-lead {
    font-size: 14px;
    
    .title {
      font-weight: bold;
      font-style: normal;
    }
    
    .description {
      margin-top: 5px;
    }
  }
}
</style>