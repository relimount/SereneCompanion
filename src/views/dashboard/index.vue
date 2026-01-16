<!-- src/views/dashboard/index.vue -->
<template>
  <div>
    <panel-head 
      title="控制台" 
      description="用于展示当前系统中的统计数据、统计报表及重要实时数据"
      style="margin-bottom: 20px;"
    />
    
    <!-- 核心数据统计卡片 -->
    <div class="dashboard-stats">
      <stat-card 
        v-for="(stat, index) in dashboardStats.stats" 
        :key="index"
        :title="stat.title"
        :value="stat.value"
        :icon="getIcon(index)"
        :trend="stat.trend"
      />
    </div>
    
    <!-- 数据可视化图表 -->
    <div class="dashboard-charts">
      <div class="chart-card">
        <h3 class="chart-title">订单状态分布</h3>
        <!-- 订单状态分布饼图 -->
        <div ref="orderStatusChart" class="chart-container"></div>
      </div>
      
      <div class="chart-card">
        <h3 class="chart-title">订单趋势分析</h3>
        <!-- 订单趋势分析折线图 -->
        <div ref="orderTrendChart" class="chart-container"></div>
      </div>
      
      <div class="chart-card">
        <h3 class="chart-title">服务类型分布</h3>
        <!-- 服务类型分布柱状图 -->
        <div ref="serviceTypeChart" class="chart-container"></div>
      </div>
    </div>
    
    <!-- 最近动态 -->
    <div class="dashboard-recent">
      <div class="recent-card">
        <h3 class="recent-title">最近创建的订单</h3>
        <div class="recent-list">
          <div v-if="recentOrders.length === 0" class="no-data">暂无数据</div>
          <table v-else class="recent-table">
            <thead>
              <tr>
                <th>订单号</th>
                <th>用户姓名</th>
                <th>服务类型</th>
                <th>订单状态</th>
                <th>创建时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id">
                <td class="order-no">{{ order.order_no }}</td>
                <td>{{ order.username }}</td>
                <td>{{ order.service_type }}</td>
                <td>
                  <span :class="['status-tag', getStatusClass(order.status)]">{{ order.status }}</span>
                </td>
                <td class="create-time">{{ order.create_time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="recent-card">
        <h3 class="recent-title">最近新增的陪护人员</h3>
        <div class="recent-list">
          <div v-if="recentStaff.length === 0" class="no-data">暂无数据</div>
          <table v-else class="recent-table">
            <thead>
              <tr>
                <th>姓名</th>
                <th>手机号</th>
                <th>性别</th>
                <th>年龄</th>
                <th>状态</th>
                <th>创建时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="staff in recentStaff" :key="staff.id">
                <td>{{ staff.name }}</td>
                <td>{{ staff.mobile }}</td>
                <td>{{ staff.sex }}</td>
                <td>{{ staff.age }}</td>
                <td>
                  <span :class="['status-tag', staff.active ? 'active' : 'inactive']">
                    {{ staff.active ? '可用' : '不可用' }}
                  </span>
                </td>
                <td class="create-time">{{ staff.create_time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Grid, Ticket, User, Check, Clock, Calendar } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import panelHead from '@/components/panelHead.vue'
import statCard from '@/components/statCard.vue'
import { 
  generateDashboardStats, 
  generateOrderStatusData, 
  generateOrderTrendData, 
  generateServiceTypeData 
} from '@/mock/dashboard'
import { generateMockOrders } from '@/mock/order'
import { generateMockData } from '@/mock/staff'

// 控制台统计数据
const dashboardStats = ref({ stats: [] })

// 最近动态数据
const recentOrders = ref([])
const recentStaff = ref([])

// 图表容器
const orderStatusChart = ref(null)
const orderTrendChart = ref(null)
const serviceTypeChart = ref(null)

// 获取统计数据
const getDashboardStats = () => {
  // 模拟API调用
  setTimeout(() => {
    dashboardStats.value = generateDashboardStats()
  }, 500)
}

// 获取最近创建的订单
const getRecentOrders = () => {
  // 模拟API调用
  setTimeout(() => {
    // 获取所有订单数据
    const allOrders = generateMockOrders(1, 100).list
    // 按创建时间排序，获取最近的10条订单
    recentOrders.value = allOrders
      .sort((a, b) => new Date(b.create_time) - new Date(a.create_time))
      .slice(0, 10)
  }, 500)
}

// 获取最近新增的陪护人员
const getRecentStaff = () => {
  // 模拟API调用
  setTimeout(() => {
    // 获取所有陪护人员数据
    const allStaff = generateMockData(1, 100).list
    // 按创建时间排序，获取最近的10条陪护人员数据
    recentStaff.value = allStaff
      .sort((a, b) => new Date(b.create_time) - new Date(a.create_time))
      .slice(0, 10)
  }, 500)
}

// 根据索引获取图标
const getIcon = (index) => {
  const icons = [Grid, Ticket, Calendar, Check, User, User]
  return icons[index] || Grid
}

// 根据订单状态获取对应的CSS类
const getStatusClass = (status) => {
  switch (status) {
    case '待支付':
      return 'pending'
    case '已支付':
      return 'paid'
    case '已完成':
      return 'completed'
    case '已取消':
      return 'canceled'
    default:
      return ''
  }
}

// 初始化订单状态分布图表
const initOrderStatusChart = () => {
  if (!orderStatusChart.value) return
  
  const chart = echarts.init(orderStatusChart.value)
  
  const data = generateOrderStatusData()
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: data.map(item => item.name),
      formatter: '{name}'
    },
    series: [
      {
        name: '订单状态',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  }
  
  chart.setOption(option)
  
  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化订单趋势分析图表
const initOrderTrendChart = () => {
  if (!orderTrendChart.value) return
  
  const chart = echarts.init(orderTrendChart.value)
  
  const data = generateOrderTrendData()
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item.date)
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [
      {
        name: '订单数',
        type: 'line',
        data: data.map(item => item.value),
        smooth: true,
        itemStyle: {
          color: '#409eff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ])
        },
        lineStyle: {
          width: 3
        }
      }
    ]
  }
  
  chart.setOption(option)
  
  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化服务类型分布图表
const initServiceTypeChart = () => {
  if (!serviceTypeChart.value) return
  
  const chart = echarts.init(serviceTypeChart.value)
  
  const data = generateServiceTypeData()
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [
      {
        name: '订单数',
        type: 'bar',
        data: data,
        barWidth: '60%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  }
  
  chart.setOption(option)
  
  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化所有图表
const initCharts = () => {
  nextTick(() => {
    initOrderStatusChart()
    initOrderTrendChart()
    initServiceTypeChart()
  })
}

// 页面加载时获取数据和初始化图表
onMounted(() => {
  // 加载所有数据
  Promise.all([
    new Promise(resolve => setTimeout(resolve, 500)), // 模拟API调用延迟
    getDashboardStats(),
    getRecentOrders(),
    getRecentStaff()
  ]).then(() => {
    // 数据加载完成后初始化图表
    initCharts()
  })
})
</script>

<style scoped>
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.dashboard-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
  color: #303133;
}

.chart-container {
  height: 300px;
  border-radius: 4px;
}

.dashboard-recent {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
}

.recent-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.recent-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
  color: #303133;
}

.recent-list {
  overflow-x: auto;
}

.no-data {
  height: 200px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
}

.recent-table {
  width: 100%;
  border-collapse: collapse;
}

.recent-table th,
.recent-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ebedf0;
}

.recent-table th {
  background-color: #f5f7fa;
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}

.recent-table td {
  font-size: 14px;
  color: #606266;
}

.status-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.pending {
  background-color: #fffbe6;
  color: #e6a23c;
  border: 1px solid #ffeaa7;
}

.status-tag.paid {
  background-color: #ecf5ff;
  color: #409eff;
  border: 1px solid #b3d8ff;
}

.status-tag.completed {
  background-color: #f0f9eb;
  color: #67c23a;
  border: 1px solid #c2e7b0;
}

.status-tag.canceled {
  background-color: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fbc4c4;
}

.status-tag.active {
  background-color: #f0f9eb;
  color: #67c23a;
  border: 1px solid #c2e7b0;
}

.status-tag.inactive {
  background-color: #f5f7fa;
  color: #909399;
  border: 1px solid #dcdfe6;
}

.order-no {
  font-family: monospace;
  word-break: break-all;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.create-time {
  font-size: 13px;
  color: #909399;
  min-width: 150px;
}

.recent-placeholder {
  height: 200px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
}
</style>