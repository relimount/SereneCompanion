import dayjs from 'dayjs'

// 生成随机订单号
export const generateOrderNo = () => {
  const dateStr = dayjs().format('YYYYMMDDHHmmss')
  const randomStr = Math.random().toString().substring(2, 8)
  return `ORD${dateStr}${randomStr}`
}

// 生成随机用户名
export const generateUsername = () => {
  const lastNames = ['张', '王', '李', '赵', '陈', '刘', '杨', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗']
  const firstNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰', '霞', '平']
  return lastNames[Math.floor(Math.random() * lastNames.length)] + firstNames[Math.floor(Math.random() * firstNames.length)]
}

// 生成随机手机号
export const generatePhone = () => {
  const prefixs = ['132', '133', '134', '135', '136', '137', '138', '139', '150', '151', '152', '153', '155', '156', '157', '158', '159', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189']
  const prefix = prefixs[Math.floor(Math.random() * prefixs.length)]
  const suffix = Math.random().toString().substring(2, 10)
  return prefix + suffix
}

// 生成随机地址
export const generateAddress = () => {
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆']
  const districts = ['朝阳区', '海淀区', '浦东新区', '黄浦区', '天河区', '越秀区', '南山区', '福田区', '西湖区', '江干区']
  const streets = ['街道1', '街道2', '街道3', '街道4', '街道5', '街道6', '街道7', '街道8', '街道9', '街道10']
  const numbers = ['号', '弄', '路']
  
  const city = cities[Math.floor(Math.random() * cities.length)]
  const district = districts[Math.floor(Math.random() * districts.length)]
  const street = streets[Math.floor(Math.random() * streets.length)]
  const number = numbers[Math.floor(Math.random() * numbers.length)]
  const houseNumber = Math.floor(Math.random() * 100) + 1
  
  return `${city}${district}${street}${houseNumber}${number}`
}

// 生成随机陪护名称
export const generateCompanionName = () => {
  const names = ['李陪护', '王陪护', '张陪护', '赵陪护', '陈陪护', '刘陪护', '杨陪护', '黄陪护', '周陪护', '吴陪护']
  return names[Math.floor(Math.random() * names.length)]
}

// 生成mock数据
export const generateMockOrders = (pageNum, pageSize) => {
  console.log('generateMockOrders called with:', pageNum, pageSize);
  
  let allOrderData = null
  let useLocalStorage = true
  
  try {
    // 检查localStorage是否可用
    localStorage.setItem('test', 'test')
    localStorage.removeItem('test')
    
    // 尝试从localStorage获取已存在的数据
    const storedData = localStorage.getItem('orderData')
    
    if (!storedData) {
      console.log('No existing data found in localStorage, generating new data...');
      // 如果没有数据，生成新的mock数据并保存到localStorage
      const total = 100
      const list = []
      const statuses = ['待支付', '已支付', '已完成', '已取消']
      const services = ['日常陪护', '康复陪护', '术后陪护', '临时陪护', '长期陪护']
      
      for (let i = 1; i <= total; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const service = services[Math.floor(Math.random() * services.length)]
        const createTime = dayjs().subtract(Math.floor(Math.random() * 30), 'day').subtract(Math.floor(Math.random() * 24), 'hour')
        const startTime = createTime.add(Math.floor(Math.random() * 24), 'hour')
        const endTime = startTime.add(Math.floor(Math.random() * 7) + 1, 'day')
        
        list.push({
          id: `order_${i}`,
          order_no: generateOrderNo(),
          username: generateUsername(),
          mobile: generatePhone(),
          address: generateAddress(),
          service_type: service,
          status: status,
          total_amount: (Math.random() * 1000 + 200).toFixed(2),
          companion_name: status === '已支付' || status === '已完成' ? generateCompanionName() : '',
          create_time: createTime.format('YYYY-MM-DD HH:mm:ss'),
          start_time: startTime.format('YYYY-MM-DD HH:mm:ss'),
          end_time: endTime.format('YYYY-MM-DD HH:mm:ss'),
          remark: Math.random() > 0.7 ? '需要特别照顾' : ''
        })
      }
      
      allOrderData = { list, total }
      console.log('Generated new data:', allOrderData);
      localStorage.setItem('orderData', JSON.stringify(allOrderData))
    } else {
      console.log('Found existing data in localStorage');
      // 如果有数据，解析localStorage中的数据
      allOrderData = JSON.parse(storedData)
      console.log('Parsed existing data:', allOrderData);
    }
  } catch (error) {
    console.error('localStorage is not available, generating data without persistence:', error);
    useLocalStorage = false
    
    // 如果localStorage不可用，直接生成mock数据
    const total = 100
    const list = []
    const statuses = ['待支付', '已支付', '已完成', '已取消']
    const services = ['日常陪护', '康复陪护', '术后陪护', '临时陪护', '长期陪护']
    
    for (let i = 1; i <= total; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const service = services[Math.floor(Math.random() * services.length)]
      const createTime = dayjs().subtract(Math.floor(Math.random() * 30), 'day').subtract(Math.floor(Math.random() * 24), 'hour')
      const startTime = createTime.add(Math.floor(Math.random() * 24), 'hour')
      const endTime = startTime.add(Math.floor(Math.random() * 7) + 1, 'day')
      
      list.push({
        id: `order_${i}`,
        order_no: generateOrderNo(),
        username: generateUsername(),
        mobile: generatePhone(),
        address: generateAddress(),
        service_type: service,
        status: status,
        total_amount: (Math.random() * 1000 + 200).toFixed(2),
        companion_name: status === '已支付' || status === '已完成' ? generateCompanionName() : '',
        create_time: createTime.format('YYYY-MM-DD HH:mm:ss'),
        start_time: startTime.format('YYYY-MM-DD HH:mm:ss'),
        end_time: endTime.format('YYYY-MM-DD HH:mm:ss'),
        remark: Math.random() > 0.7 ? '需要特别照顾' : ''
      })
    }
    
    allOrderData = { list, total }
    console.log('Generated data without localStorage:', allOrderData);
  }
  
  // 根据分页参数返回对应的数据
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const paginatedList = allOrderData.list.slice(start, end)
  
  console.log('Returning paginated data:', paginatedList, 'total:', allOrderData.total);
  return { list: paginatedList, total: allOrderData.total }
}

// 模拟更新订单
export const mockUpdateOrder = (orderData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 从localStorage获取已存在的数据
      let allOrderData = localStorage.getItem('orderData')
      if (!allOrderData) {
        // 如果没有数据，直接返回错误
        resolve({
          code: 50000,
          message: '数据不存在'
        })
        return
      }
      
      allOrderData = JSON.parse(allOrderData)
      
      // 查找要更新的订单
      const index = allOrderData.list.findIndex(item => item.id === orderData.id)
      if (index === -1) {
        // 如果找不到，返回错误
        resolve({
          code: 50000,
          message: '订单不存在'
        })
        return
      }
      
      // 更新数据
      allOrderData.list[index] = {
        ...allOrderData.list[index],
        ...orderData
      }
      
      // 保存到localStorage
      localStorage.setItem('orderData', JSON.stringify(allOrderData))
      
      resolve({
        code: 10000,
        message: '订单更新成功',
        data: allOrderData.list[index]
      })
    }, 500)
  })
}
