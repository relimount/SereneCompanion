<template>
  <panel-head 
      title="陪护管理" 
      description="陪护师可以进行创建和修改，设置对应生效状态控制C端选择"
    />
  <div class="btn">
    <el-button :icon="Plus" type="primary" @click="handleAdd" size="small">新增</el-button>
    <el-button :icon="Delete" type="danger" @click="handleDelete" size="small">删除</el-button>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="添加陪护"
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
        <el-input v-model="form.age" type="number" placeholder="请输入年龄"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button type="primary" v-if = "!form.avatar" @click="handleAvatarUpload">上传头像</el-button>
        <el-image v-else :src="form.avatar" style="width: 100px; height: 100px;"></el-image>
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
import { ref, reactive } from 'vue'

const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({
  id: '',
  mobile: '',
  active: 1,
  age: '',
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
    { required: true, message: '请输入头像URL', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ]
})

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
    age: '',
    avatar: '',
    name: '',
    sex: '',
  })
  // 打开弹窗
  dialogVisible.value = true
}

// 处理删除按钮点击
const handleDelete = () => {
  // 这里可以添加删除逻辑
  console.log('删除')
}

// 处理表单提交
const handleSubmit = () => {
  if (!formRef.value) return
  
  formRef.value.validate((valid) => {
    if (valid) {
      // 表单验证通过，可以提交数据
      console.log('表单验证通过', form)
      // 这里可以添加提交表单的逻辑
      dialogVisible.value = false
    } else {
      // 表单验证失败
      console.log('表单验证失败')
      return false
    }
  })
}
</script>

<style scoped>
.btn {
  background-color: #fff;
  padding: 10px;
}
</style>
