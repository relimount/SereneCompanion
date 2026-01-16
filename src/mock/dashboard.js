import dayjs from 'dayjs'
import { generateMockOrders } from './order'
import { generateMockData } from './staff'

// 生成控制台统计数据
export const generateDashboardStats = () => {
  // 从order.js获取实际订单数据
  const allOrders = generateMockOrders(1, 100).list
  // 从staff.js获取实际陪护人员数据
  const allStaff = generateMockData(1, 100).list
  
  // 计算总订单数
  const totalOrders = allOrders.length
  
  // 计算今日新增订单（当天创建的订单）
  const today = dayjs().format('YYYY-MM-DD')
  const todayOrders = allOrders.filter(order => {
    return dayjs(order.create_time).format('YYYY-MM-DD') === today
  }).length
  
  // 计算待处理订单（待支付、已支付但未完成的订单）
  const pendingOrders = allOrders.filter(order => {
    return order.status === '待支付' || order.status === '已支付'
  }).length
  
  // 计算已完成订单
  const completedOrders = allOrders.filter(order => {
    return order.status === '已完成'
  }).length
  
  // 计算陪护人员总数
  const totalStaff = allStaff.length
  
  // 计算可用陪护人员（active=1的人员）
  const availableStaff = allStaff.filter(staff => {
    return staff.active === 1
  }).length
  
  // 基于当前值和基础值（昨日值）计算趋势百分比
  const generateTrend = (currentValue, baseValue) => {
    if (baseValue === 0) return 0
    const trend = ((currentValue - baseValue) / baseValue) * 100
    // 取整并限制在-30%到+30%之间
    return Math.max(-30, Math.min(30, Math.round(trend)))
  }
  
  // 去掉随机，使用固定比例的昨日数据（当前值的90%）
  const yesterdayTotalOrders = Math.max(0, Math.floor(totalOrders * 0.9))
  const yesterdayTodayOrders = Math.max(0, Math.floor(todayOrders * 0.9))
  const yesterdayPendingOrders = Math.max(0, Math.floor(pendingOrders * 0.9))
  const yesterdayCompletedOrders = Math.max(0, Math.floor(completedOrders * 0.9))
  const yesterdayTotalStaff = Math.max(0, Math.floor(totalStaff * 0.9))
  const yesterdayAvailableStaff = Math.max(0, Math.floor(availableStaff * 0.9))
  
  return {
    stats: [
      {
        title: '总订单数',
        value: totalOrders,
        trend: generateTrend(totalOrders, yesterdayTotalOrders)
      },
      {
        title: '今日新增订单',
        value: todayOrders,
        trend: generateTrend(todayOrders, yesterdayTodayOrders)
      },
      {
        title: '待处理订单',
        value: pendingOrders,
        trend: generateTrend(pendingOrders, yesterdayPendingOrders)
      },
      {
        title: '已完成订单',
        value: completedOrders,
        trend: generateTrend(completedOrders, yesterdayCompletedOrders)
      },
      {
        title: '陪护人员总数',
        value: totalStaff,
        trend: generateTrend(totalStaff, yesterdayTotalStaff)
      },
      {
        title: '可用陪护人员',
        value: availableStaff,
        trend: generateTrend(availableStaff, yesterdayAvailableStaff)
      }
    ]
  }
}

// 生成订单状态分布数据
export const generateOrderStatusData = () => {
  // 从order.js获取实际订单数据
  const allOrders = generateMockOrders(1, 100).list
  
  // 计算各状态订单数量
  const statusCount = {
    '待支付': 0,
    '已支付': 0,
    '已完成': 0,
    '已取消': 0
  }
  
  allOrders.forEach(order => {
    if (statusCount.hasOwnProperty(order.status)) {
      statusCount[order.status]++
    }
  })
  
  // 返回格式化的状态分布数据
  return [
    { name: '待支付', value: statusCount['待支付'], itemStyle: { color: '#e6a23c' } },
    { name: '已支付', value: statusCount['已支付'], itemStyle: { color: '#409eff' } },
    { name: '已完成', value: statusCount['已完成'], itemStyle: { color: '#67c23a' } },
    { name: '已取消', value: statusCount['已取消'], itemStyle: { color: '#f56c6c' } }
  ]
}

// 生成订单趋势数据
export const generateOrderTrendData = () => {
  // 从order.js获取实际订单数据
  const allOrders = generateMockOrders(1, 100).list
  
  const days = 7
  const data = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day')
    const dateStr = date.format('YYYY-MM-DD')
    const dateLabel = date.format('MM-DD')
    
    // 计算当天的订单数量
    const count = allOrders.filter(order => {
      return dayjs(order.create_time).format('YYYY-MM-DD') === dateStr
    }).length
    
    data.push({
      date: dateLabel,
      value: count
    })
  }
  
  return data
}

// 生成服务类型分布数据
export const generateServiceTypeData = () => {
  // 从order.js获取实际订单数据
  const allOrders = generateMockOrders(1, 100).list
  
  // 计算各服务类型的订单数量
  const serviceCount = {
    '日常陪护': 0,
    '康复陪护': 0,
    '术后陪护': 0,
    '临时陪护': 0,
    '长期陪护': 0
  }
  
  allOrders.forEach(order => {
    if (serviceCount.hasOwnProperty(order.service_type)) {
      serviceCount[order.service_type]++
    }
  })
  
  // 返回格式化的服务类型分布数据
  return [
    { name: '日常陪护', value: serviceCount['日常陪护'], itemStyle: { color: '#409eff' } },
    { name: '康复陪护', value: serviceCount['康复陪护'], itemStyle: { color: '#67c23a' } },
    { name: '术后陪护', value: serviceCount['术后陪护'], itemStyle: { color: '#e6a23c' } },
    { name: '临时陪护', value: serviceCount['临时陪护'], itemStyle: { color: '#f56c6c' } },
    { name: '长期陪护', value: serviceCount['长期陪护'], itemStyle: { color: '#909399' } }
  ]
}
