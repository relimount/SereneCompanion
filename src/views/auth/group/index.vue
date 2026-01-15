<template>
  <panel-head 
      title="菜单管理" 
      description="菜单规则通常对应一个控制器的方法，同时菜单栏数据也从规则中获取"
    />
  <div class="btn">
    <el-button :icon="Plus" type="primary" @click="handleAdd" size="small">新增</el-button>
  </div>
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
      prop="permissionName"
      label="菜单权限"
    />
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
      prop = "id"
      v-show = false
      >
        <el-input 
        v-model="form.id" 
        />
      </el-form-item>
      <el-form-item 
      label="权限名称" 
      prop="name"
      >
        <el-input 
        v-model="form.name" 
        placeholder="请输入权限名称" 
        />
      </el-form-item>
      <el-form-item 
      label="权限列表" 
      prop="permissions"
      >
        <el-tree
          ref="treeRef"
          :data="permissionData"
          style = "max-width: 600px"
          show-checkbox
          node-key="id"
          :default-checked-keys="defaultKeys"
          :default-expanded-keys="[2]"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { reactive,ref,onMounted,nextTick } from 'vue'
  import { ElMessage } from 'element-plus'
  import { getMenu,setMenu,menuList } from '@/api/index'
  import panelHead from '@/components/panelHead.vue'
  import { Plus } from '@element-plus/icons-vue'

  onMounted(() => {
    getMenu().then(({ data }) => {
      console.log(data.data)
      permissionData.value = data.data
    })
    getMenuList()
  })

  const tableData = reactive({
    list: [],
    total: 0
  })

  //打开弹窗
  const open = (rowData = {}) =>{
    dialogVisible.value = true
    nextTick(() => {
      if(rowData){
        console.log('编辑数据:', rowData)
        Object.assign(form,{
          id: rowData.id,
          name: rowData.name,
        })
        
        // 解析权限数据为数组 - 注意：属性名是permission（单数）而不是permissions（复数）
        let permissions = []
        if(rowData.permission) {
          try {
            permissions = typeof rowData.permission === 'string' 
              ? JSON.parse(rowData.permission) 
              : Array.isArray(rowData.permission) 
                ? rowData.permission 
                : []
          } catch (error) {
            console.error('解析权限数据失败:', error)
            permissions = []
          }
        }
        console.log('解析后的权限数据:', permissions)
        
        // 设置树组件选中状态（确保treeRef存在）
        if(treeRef.value) {
          treeRef.value.setCheckedKeys(permissions)
        } else {
          console.error('treeRef is undefined')
        }
      }
    })
  }

  //新增权限
  const handleAdd = () => {
    // 重置表单数据
    form.id = ''
    form.name = ''
    
    // 重置树组件选中状态
    if(treeRef.value) {
      treeRef.value.setCheckedKeys([])
    }
    
    // 打开弹窗
    dialogVisible.value = true
  }

  const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
})

const getMenuList = () => {
  menuList(paginationData).then(({ data }) => {
    console.log('API返回数据:', data)
    tableData.list = Array.isArray(data.data) ? data.data : (data.data?.list ?? [])
    
    // 确保total有值，如果API没有返回total，则使用列表长度
    tableData.total = data.total || tableData.list.length
    console.log('tableData.total:', tableData.total)
  }).catch(error => {
    console.error('获取菜单列表失败:', error)
    // 错误处理，确保total至少为0
    tableData.total = 0
  })
}

  const form = reactive({
    id: '',
    name: '',
    permissions: ''
  })

  //定义弹窗显示状态
  const dialogVisible = ref(false)

  //定义权限数据
  const permissionData = ref([])

  //定义默认选中的权限
  const defaultKeys = ref([4 , 5])

  //定义表单引用
  const formRef = ref()
  //定义树引用
  const treeRef = ref()

  //定义表单验证规则
  const rules = ref({
    name: [
      { required: true, message: '请输入权限名称', trigger: 'blur' }
    ],
  })

  const submitForm = async () => {
    if(!formRef.value) return
    formRef.value.validate((valid, fields) => {
      if (valid) {
        const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
        setMenu({
          name: form.name,
          permissions,
          id: form.id
        }).then(({ data }) => {
          if(data.code === 10000){
            ElMessage.success('添加成功')
            dialogVisible.value = false
          }
        })
      }else{
        console.log('表单验证失败',fields)
        return false
      }
    })
  }
  //分页大小改变
  const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getMenuList()
  }
  //分页当前页改变
  const handleCurrentChange = (val) => {
    paginationData.pageNum = val
    getMenuList()
  }
</script>

<style scoped>
.btn {
  background-color: #fff;
  padding: 10px;
}
  
.pagination-info {
  text-align: right;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}
</style>