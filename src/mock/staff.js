import dayjs from 'dayjs'

// 生成随机手机号
export const generatePhone = () => {
  const prefixs = ['132', '133', '134', '135', '136', '137', '138', '139', '150', '151', '152', '153', '155', '156', '157', '158', '159', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189']
  const prefix = prefixs[Math.floor(Math.random() * prefixs.length)]
  const suffix = Math.random().toString().substring(2, 10)
  return prefix + suffix
}

// 生成随机姓名
export const generateName = () => {
  const lastNames = ['张', '王', '李', '赵', '陈', '刘', '杨', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗']
  const firstNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰', '霞', '平']
  return lastNames[Math.floor(Math.random() * lastNames.length)] + firstNames[Math.floor(Math.random() * firstNames.length)]
}

// 生成随机头像
export const generateAvatar = () => {
  // 使用随机头像API
  return `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
}

// 生成mock数据
export const generateMockData = (pageNum, pageSize) => {
  // 尝试从localStorage获取已存在的数据
  let allStaffData = localStorage.getItem('staffData')
  
  if (!allStaffData) {
    // 如果没有数据，生成新的mock数据并保存到localStorage
    const total = 50
    const list = []
    
    for (let i = 1; i <= total; i++) {
      list.push({
        id: `staff_${i}`,
        name: generateName(),
        mobile: generatePhone(),
        sex: Math.random() > 0.5 ? '男' : '女',
        age: Math.floor(Math.random() * 43) + 18, // 18-60岁
        avatar: generateAvatar(),
        active: Math.random() > 0.2 ? 1 : 0, // 80%概率正常
        create_time: dayjs().subtract(Math.floor(Math.random() * 365), 'day').format('YYYY-MM-DD HH:mm:ss')
      })
    }
    
    allStaffData = { list, total }
    localStorage.setItem('staffData', JSON.stringify(allStaffData))
  } else {
    // 如果有数据，解析localStorage中的数据
    allStaffData = JSON.parse(allStaffData)
  }
  
  // 根据分页参数返回对应的数据
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const paginatedList = allStaffData.list.slice(start, end)
  
  return { list: paginatedList, total: allStaffData.total }
}

// 模拟新增陪护人员
export const mockAddStaff = (staffData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 从localStorage获取已存在的数据
      let allStaffData = localStorage.getItem('staffData')
      if (!allStaffData) {
        allStaffData = { list: [], total: 0 }
      } else {
        allStaffData = JSON.parse(allStaffData)
      }
      
      // 生成新的id
      const newId = `staff_${Date.now()}`
      // 创建新的陪护人员数据
      const newStaff = {
        id: newId,
        ...staffData,
        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      
      // 添加到数据列表
      allStaffData.list.unshift(newStaff)
      allStaffData.total++
      
      // 保存到localStorage
      localStorage.setItem('staffData', JSON.stringify(allStaffData))
      
      resolve({
        code: 10000,
        message: '陪护师创建成功',
        data: newStaff
      })
    }, 500)
  })
}

// 模拟编辑陪护人员
export const mockEditStaff = (staffData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 从localStorage获取已存在的数据
      let allStaffData = localStorage.getItem('staffData')
      if (!allStaffData) {
        // 如果没有数据，直接返回错误
        resolve({
          code: 50000,
          message: '数据不存在'
        })
        return
      }
      
      allStaffData = JSON.parse(allStaffData)
      
      // 查找要编辑的陪护人员
      const index = allStaffData.list.findIndex(item => item.id === staffData.id)
      if (index === -1) {
        // 如果找不到，返回错误
        resolve({
          code: 50000,
          message: '陪护师不存在'
        })
        return
      }
      
      // 更新数据
      allStaffData.list[index] = staffData
      
      // 保存到localStorage
      localStorage.setItem('staffData', JSON.stringify(allStaffData))
      
      resolve({
        code: 10000,
        message: '陪护师编辑成功',
        data: staffData
      })
    }, 500)
  })
}

// 模拟删除陪护人员
export const mockDeleteStaff = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 从localStorage获取已存在的数据
      let allStaffData = localStorage.getItem('staffData')
      if (!allStaffData) {
        // 如果没有数据，直接返回成功
        resolve({
          code: 10000,
          message: '删除成功'
        })
        return
      }
      
      allStaffData = JSON.parse(allStaffData)
      
      // 查找要删除的陪护人员
      const index = allStaffData.list.findIndex(item => item.id === id)
      if (index === -1) {
        // 如果找不到，返回成功
        resolve({
          code: 10000,
          message: '删除成功'
        })
        return
      }
      
      // 删除数据
      allStaffData.list.splice(index, 1)
      allStaffData.total--
      
      // 保存到localStorage
      localStorage.setItem('staffData', JSON.stringify(allStaffData))
      
      resolve({
        code: 10000,
        message: '删除成功'
      })
    }, 500)
  })
}
