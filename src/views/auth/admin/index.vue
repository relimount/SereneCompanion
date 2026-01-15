<template>
  <div>
    <!-- 使用panelHead组件并传递自定义的title和description -->
    <panel-head 
      title="账号管理" 
      description="管理员可以进行编辑，权限修改后需要登出才会生效"
    />
    <el-table 
      :data="tableData.list"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
      />
      <el-table-column
        prop="name"
        label="昵称"
      />
      <el-table-column
        prop="permissions_name"
        label="所属组别"
      >
        <template #default="scope">
          {{ permissionName(scope.row.permissions_id) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
      />
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
      <el-table-column
        label="创建时间"
      >
        <template #default="scope">
          <div class="flex-box">
            <el-icon class="icon">
              <Clock />
            </el-icon>
            <span style="margin-left: 5px;">{{ scope.row.create_time }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary"  @click="open(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-info">
      <el-pagination
        v-model:current-page="paginationData.pageNum"
        :page-size="paginationData.pageSize"
        :background="false"
        size = "small"
        layout="total, prev, pager, next"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    title="添加权限"
    :visible.sync="dialogVisible"
    width="50%"
  >
    <el-form
      :rules="rules"
      ref="formRef"
      :model="form"
      label-width="100px"
      label-position="left"
    >
      <el-form-item 
      label="手机号" 
      prop="mobile"
      >
        <el-input 
        v-model="form.mobile" 
        disabled
        />
      </el-form-item>
      <el-form-item 
      label="昵称" 
      prop="name"
      >
        <el-input 
        v-model="form.name" 
        placeholder="请输入昵称" 
        />
      </el-form-item>
      <el-form-item 
      label="菜单权限" 
      prop="permissions_id"
      >
        <el-select
        v-model="form.permissions_id"
        placeholder="请选择菜单权限"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
  </div>
</template>

<script setup>
import { authAdmin, menuSelectList, updateUser } from '@/api/index'
import { ref,reactive,onMounted } from 'vue'
import panelHead from '@/components/panelHead.vue'
import { Plus } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

//表单提交和校验
const rules = ref({
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
  ],
  permissions_id: [
    { required: true, message: '请选择菜单权限', trigger: 'change' },
  ],
})
const formRef = ref()
const submitForm = async () => {
  if(!formRef.value) return
  formRef.value.validate((valid, fields) => {
    if (valid) {
      updateUser({
        name: form.name,
        permissions_id: form.permissions_id,
      }).then(({ data }) => {
        if(data.code === 10000){
          ElMessage.success('添加成功')
          // 刷新账号列表
          getAdminList()
          dialogVisible.value = false
        }
      })
    }else{
      console.log('表单验证失败',fields)
      return false
    }
  })
}

// 定义弹窗是否可见
const dialogVisible = ref(false)
// 定义表单数据
const form = reactive({
  name: '',
  permissions_id: '',
})

// 定义表格数据
const tableData = reactive({
  list: [],
  total: 0
})

// 定义分页数据
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
})
// 定义下拉列表数据
const options = ref([])

// 获取账号列表
const getAdminList = () => {
  authAdmin(paginationData).then(({ data }) => {
    console.log('账号数据:', data)
    const { list, total } = data.data 
    list.forEach(item => {
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
    })
    // 根据API返回的数据结构设置tableData
    tableData.list = list
    tableData.total = total
  }).catch(error => {
    console.error('获取账号数据失败:', error)
    tableData.list = []
  })
}
// 下拉列表名称
const permissionName = (id) => {
  const item = options.value.find(item => item.id === id)
  return item? item.name : '超级管理员'
}

// 打开弹窗（新增/编辑）
const open = (rowData = {}) => {
  console.log('打开弹窗:', rowData)
  // 这里可以添加弹窗逻辑
  dialogVisible.value = true
  form.mobile = rowData.mobile || ''
  form.name = rowData.name || ''
  form.permissions_id = rowData.permissions_id || ''
}

// 新增账号
const handleAdd = () => {
  open()
}

// 页面加载时获取数据
onMounted(() => {
  getAdminList()
  // 下拉列表
  menuSelectList().then(({ data }) => {
    options.value =  data.data
  }).catch(error => {
    console.error('获取菜单权限下拉列表失败:', error)
  })
})

// 分页大小改变时触发
const handleSizeChange = (val) => {
  paginationData.pageSize = val
  getAdminList()
}

// 分页当前页改变时触发
const handleCurrentChange = (val) => {
  paginationData.pageNum = val
  getAdminList()
}

</script>

<style scoped>
.flex-box {
  display: flex;
  align-items: center;
}

</style>
