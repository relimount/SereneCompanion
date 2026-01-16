<template>
  <div>
    <!-- 使用panelHead组件并传递自定义的title和description -->
    <panel-head 
      title="订单管理" 
      description="查看和管理用户创建的订单"
    />
    
    <!-- 表格 -->
    <el-table 
      :data="tableData.list"
      style="width: 100%"
      v-loading="tableLoading"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
      />
      <el-table-column
        prop="order_no"
        label="订单号"
        width="200"
      />
      <el-table-column
        prop="username"
        label="用户姓名"
      />
      <el-table-column
        prop="mobile"
        label="手机号"
        width="120"
      />
      <el-table-column
        prop="address"
        label="服务地址"
        min-width="150"
      />
      <el-table-column
        prop="service_type"
        label="服务类型"
      />
      <el-table-column
        prop="status"
        label="状态"
      >
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="total_amount"
        label="订单金额"
        width="120"
        :formatter="formatterMoney"
      />
      <el-table-column
        prop="companion_name"
        label="陪护人员"
      />
      <el-table-column
        prop="create_time"
        label="创建时间"
        width="160"
      />
      <el-table-column
        prop="start_time"
        label="服务开始时间"
        width="160"
      />
      <el-table-column
        prop="end_time"
        label="服务结束时间"
        width="160"
      />
      <el-table-column
        prop="remark"
        label="备注"
      />

      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="primary" size="small" @click="open(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination-info">
      <el-pagination
        v-model:current-page="paginationData.pageNum"
        :page-size="paginationData.pageSize"
        :background="false"
        size="small"
        layout="total, prev, pager, next"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <!-- 弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="50%"
    >
      <el-form
        :rules="rules"
        ref="formRef"
        :model="form"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="订单号" prop="order_no">
          <el-input v-model="form.order_no" disabled />
        </el-form-item>
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="form.username" disabled />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" disabled />
        </el-form-item>
        <el-form-item label="服务地址" prop="address">
          <el-input v-model="form.address" disabled />
        </el-form-item>
        <el-form-item label="服务类型" prop="service_type">
          <el-select v-model="form.service_type" placeholder="请选择服务类型" disabled>
            <el-option label="日常陪护" value="日常陪护" />
            <el-option label="康复陪护" value="康复陪护" />
            <el-option label="术后陪护" value="术后陪护" />
            <el-option label="临时陪护" value="临时陪护" />
            <el-option label="长期陪护" value="长期陪护" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择订单状态">
            <el-option label="待支付" value="待支付" />
            <el-option label="已支付" value="已支付" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已取消" value="已取消" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单金额" prop="total_amount">
          <el-input v-model="form.total_amount" disabled />
        </el-form-item>
        <el-form-item label="陪护人员" prop="companion_name">
          <el-input v-model="form.companion_name" placeholder="请输入陪护人员姓名" />
        </el-form-item>
        <el-form-item label="服务开始时间" prop="start_time">
          <el-date-picker
            v-model="form.start_time"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="服务结束时间" prop="end_time">
          <el-date-picker
            v-model="form.end_time"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElTable } from 'element-plus'
import panelHead from '@/components/panelHead.vue'
import dayjs from 'dayjs'
import { generateMockOrders, mockUpdateOrder } from '@/mock/order'

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('编辑订单')
const formRef = ref(null)
const form = reactive({
  id: '',
  order_no: '',
  username: '',
  mobile: '',
  address: '',
  service_type: '',
  status: '',
  total_amount: '',
  companion_name: '',
  create_time: '',
  start_time: '',
  end_time: '',
  remark: ''
})

// 表单校验规则
const rules = reactive({
  status: [
    { required: true, message: '请选择订单状态', trigger: 'change' }
  ],
  companion_name: [
    { required: true, message: '请输入陪护人员姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '陪护人员姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  start_time: [
    { required: true, message: '请选择服务开始时间', trigger: 'change' }
  ],
  end_time: [
    { required: true, message: '请选择服务结束时间', trigger: 'change' }
  ]
})

// 表格相关
const tableLoading = ref(false)
const tableData = reactive({
  list: [],
  total: 0
})

// 分页相关
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
})

// 格式化金额
const formatterMoney = (row, column, cellValue) => {
  return '¥' + cellValue
}

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case '待支付':
      return 'warning'
    case '已支付':
      return 'primary'
    case '已完成':
      return 'success'
    case '已取消':
      return 'danger'
    default:
      return ''
  }
}

// 获取订单列表
const getOrderList = () => {
  console.log('getOrderList called with pagination:', paginationData);
  tableLoading.value = true
  
  // 使用mock模拟接口调用
  setTimeout(() => {
    const { list, total } = generateMockOrders(paginationData.pageNum, paginationData.pageSize)
    console.log('Received data from generateMockOrders:', { list, total });
    tableData.list = list
    tableData.total = total
    console.log('Updated tableData:', tableData);
    tableLoading.value = false
  }, 500)
}

// 分页大小改变时触发
const handleSizeChange = (val) => {
  paginationData.pageSize = val
  getOrderList()
}

// 分页当前页改变时触发
const handleCurrentChange = (val) => {
  paginationData.pageNum = val
  getOrderList()
}

// 打开弹窗（编辑）
const open = (rowData) => {
  dialogVisible.value = true
  // 复制行数据到表单
  Object.assign(form, rowData)
}

// 处理表单提交
const handleSubmit = () => {
  if (!formRef.value) return
  
  formRef.value.validate((valid) => {
    if (valid) {
      tableLoading.value = true
      // 使用mock模拟更新接口调用
      mockUpdateOrder(form).then(response => {
        if (response.code === 10000) {
          ElMessage.success(response.message)
          // 刷新订单列表
          getOrderList()
          dialogVisible.value = false
        } else {
          ElMessage.error(response.message || '更新失败')
        }
        tableLoading.value = false
      }).catch(error => {
        console.error('更新失败:', error)
        ElMessage.error('更新失败')
        tableLoading.value = false
      })
    } else {
      // 表单验证失败
      console.log('表单验证失败')
      return false
    }
  })
}

// 页面加载时获取数据
onMounted(() => {
  getOrderList()
})
</script>

<style scoped>
.pagination-info {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  background-color: #fff;
  padding: 10px;
}

/* 表格样式 */
:deep(.el-table) {
  margin-bottom: 0;
}

:deep(.el-table__header-wrapper) {
  background-color: #fafafa;
}

:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

/* 操作按钮样式 */
:deep(.el-button--small) {
  margin-right: 5px;
}
</style>