<template>
  <panel-head 
      title="陪护管理" 
      description="陪护师可以进行创建和修改，设置对应生效状态控制C端选择"
    />
  <div class="btn">
    <el-button :icon="Plus" type="primary" @click="handleAdd" size="small">新增</el-button>
    <el-button :icon="Delete" type="danger" @click="handleDelete" size="small">删除</el-button>
  </div>
  
  <!-- 表格 -->
  <el-table 
    :data="tableData.list"
    style="width: 100%"
    v-loading="tableLoading"
  >
    <el-table-column
      prop="id"
      label="ID"
    />
    <el-table-column
      prop="name"
      label="姓名"
    />
    <el-table-column
      prop="mobile"
      label="手机号"
    />
    <el-table-column
      prop="sex"
      label="性别"
    />
    <el-table-column
      prop="age"
      label="年龄"
    />
    <el-table-column
      prop="avatar"
      label="头像"
    >
      <template #default="scope">
        <el-image
          v-if="scope.row.avatar"
          :src="scope.row.avatar"
          style="width: 40px; height: 40px; border-radius: 50%"
          fit="cover"
        ></el-image>
        <span v-else>无</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="active"
      label="状态"
    >
      <template #default="scope">
        <el-tag :type="scope.row.active === 1 ? 'success' : 'danger'">
          {{ scope.row.active === 1 ? '正常' : '失效' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
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
      label-width="100px"
      label-position="left"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id" ></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="form.age" type="number" placeholder="请输入年龄"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <div class="avatar-uploader">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :http-request="handleHttpRequest"
          >
            <el-image v-if="form.avatar" :src="form.avatar" style="width: 100px; height: 100px;" fit="cover">
              <template #error>
                <div class="image-error">
                  <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                </div>
              </template>
              <template #operations>
                <el-button
                  type="text"
                  size="small"
                  icon="el-icon-delete"
                  @click="handleAvatarDelete"
                />
              </template>
            </el-image>
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="状态" prop="active">
        <el-switch v-model="form.active" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { Plus, Delete } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElUpload } from 'element-plus'
import dayjs from 'dayjs'
import { generateMockData, mockAddStaff, mockEditStaff, mockDeleteStaff } from '@/mock/staff'

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('添加陪护')
const formRef = ref(null)
const form = reactive({
  id: '',
  mobile: '',
  active: 1,
  age: 0,
  avatar: '',
  name: '',
  sex: '',
})

// 表单校验规则
const rules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 18, max: 60, message: '年龄必须在 18 到 60 岁之间', trigger: 'blur' }
  ],
  avatar: [
    { required: true, message: '请上传头像', trigger: 'change' }
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

// 获取陪护列表
const getStaffList = () => {
  tableLoading.value = true
  
  // 使用mock模拟接口调用
  setTimeout(() => {
    const { list, total } = generateMockData(paginationData.pageNum, paginationData.pageSize)
    tableData.list = list
    tableData.total = total
    tableLoading.value = false
  }, 500)
}

// 分页大小改变时触发
const handleSizeChange = (val) => {
  paginationData.pageSize = val
  getStaffList()
}

// 分页当前页改变时触发
const handleCurrentChange = (val) => {
  paginationData.pageNum = val
  getStaffList()
}

// 上传前的校验
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 自定义上传请求（使用mock模拟）
const handleHttpRequest = (options) => {
  const { file, onSuccess } = options
  
  // 模拟上传延迟
  setTimeout(() => {
    // 创建一个模拟的图片URL
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      // 模拟接口返回的数据结构
      const mockResponse = {
        code: 10000,
        message: '上传成功',
        data: {
          url: e.target.result // 使用base64编码的图片URL作为模拟数据
        }
      }
      
      // 调用上传成功回调
      onSuccess(mockResponse)
    }
  }, 500)
}

// 上传成功后的处理
const handleAvatarSuccess = (response) => {
  if (response.code === 10000) {
    form.avatar = response.data.url
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error(response.message || '头像上传失败')
  }
}

// 删除头像
const handleAvatarDelete = () => {
  form.avatar = ''
  ElMessage.success('头像已删除')
}

// 处理新增按钮点击
const handleAdd = () => {
  // 重置表单
  if (formRef.value) {
    formRef.value.resetFields()
  }
  // 重置表单数据
  Object.assign(form, {
    id: '',
    mobile: '',
    active: 1,
    age: 0,
    avatar: '',
    name: '',
    sex: '',
  })
  // 设置弹窗标题
  dialogTitle.value = '添加陪护'
  // 打开弹窗
  dialogVisible.value = true
}

// 处理编辑按钮点击
const handleEdit = (row) => {
  // 重置表单
  if (formRef.value) {
    formRef.value.resetFields()
  }
  // 设置表单数据
  Object.assign(form, row)
  // 设置弹窗标题
  dialogTitle.value = '编辑陪护'
  // 打开弹窗
  dialogVisible.value = true
}

// 处理删除按钮点击
const handleDelete = (row) => {
  ElMessage.confirm('确定要删除这个陪护人员吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    tableLoading.value = true
    // 使用mock模拟删除接口调用
    mockDeleteStaff(row.id).then(response => {
      if (response.code === 10000) {
        // 从表格数据中删除
        const index = tableData.list.findIndex(item => item.id === row.id)
        if (index !== -1) {
          tableData.list.splice(index, 1)
          tableData.total--
        }
        ElMessage.success(response.message)
      } else {
        ElMessage.error(response.message || '删除失败')
      }
      tableLoading.value = false
    }).catch(error => {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
      tableLoading.value = false
    })
  }).catch(() => {
    // 用户取消删除
  })
}

// 处理表单提交
const handleSubmit = () => {
  if (!formRef.value) return
  
  formRef.value.validate((valid) => {
    if (valid) {
      tableLoading.value = true
      // 根据是否有id判断是新增还是编辑
      const request = form.id ? mockEditStaff(form) : mockAddStaff(form)
      
      request.then(response => {
        if (response.code === 10000) {
          ElMessage.success(response.message)
          
          if (form.id) {
            // 编辑操作
            const index = tableData.list.findIndex(item => item.id === form.id)
            if (index !== -1) {
              tableData.list[index] = response.data
            }
          } else {
            // 新增操作
            tableData.list.unshift(response.data)
            tableData.total++
          }
          
          dialogVisible.value = false
        } else {
          ElMessage.error(response.message || '操作失败')
        }
        tableLoading.value = false
      }).catch(error => {
        console.error('操作失败:', error)
        ElMessage.error('操作失败')
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
  getStaffList()
})
</script>

<style scoped>
.btn {
  background-color: #fff;
  padding: 10px;
  margin-bottom: 20px;
}

.avatar-uploader {
  display: flex;
  align-items: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-error {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #909399;
}

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
