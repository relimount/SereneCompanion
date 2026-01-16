<template>
  <div class="stat-card">
    <div class="stat-card-header">
      <h3 class="stat-card-title">{{ title }}</h3>
      <el-icon class="stat-card-icon" :size="32">
        <component :is="icon" />
      </el-icon>
    </div>
    <div class="stat-card-content">
      <div class="stat-card-value">{{ value }}</div>
      <div v-if="trend" class="stat-card-trend">
        <span :class="trend > 0 ? 'trend-up' : 'trend-down'">
          {{ trend > 0 ? '+' : '' }}{{ trend }}%
        </span>
        <span class="trend-label">较昨日</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  // 卡片标题
  title: {
    type: String,
    required: true
  },
  // 卡片数值
  value: {
    type: String || Number,
    required: true
  },
  // 卡片图标
  icon: {
    type: Object,
    required: true
  },
  // 趋势百分比（可选）
  trend: {
    type: Number,
    default: null
  }
})
</script>

<style scoped>
.stat-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

.stat-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.stat-card-title {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin: 0;
}

.stat-card-icon {
  color: #409eff;
}

.stat-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-card-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.stat-card-trend {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.trend-up {
  font-size: 14px;
  font-weight: 500;
  color: #67c23a;
}

.trend-down {
  font-size: 14px;
  font-weight: 500;
  color: #f56c6c;
}

.trend-label {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}
</style>