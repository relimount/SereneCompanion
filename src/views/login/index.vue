<template>
  <el-row class = "login-container" type="flex" justify="center" align="middle">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="">
        </div>
      </template>
      <div class="jump-link">
          <el-link type="primary" @click="handleSwitch">{{ formType ? '立即注册' : '返回登录' }}</el-link>
        </div>
        <el-form 
          ref="loginForm" 
          :model="formData" 
          :rules="rules"
        > 
          <el-form-item prop="username"> 
            <el-input v-model="formData.username" placeholder="请输入用户名" :prefix-icon="UserFilled" ></el-input>
          </el-form-item>
          <el-form-item prop="password"> 
            <el-input v-model="formData.password" placeholder="请输入密码" type="password" :prefix-icon="Lock"></el-input>
          </el-form-item>
          <el-form-item prop="code"> 
            <el-input v-model="formData.code" v-if = "formType === 0" placeholder="请输入验证码" :prefix-icon="Lock">
              <template #append>
                <span 
                  @click="handleSendCode" 
                  :class="['send-code-btn', { 'send-code-disabled': isSending }]"
                  :style="{ pointerEvents: isSending ? 'none' : 'auto' }"
                >{{ sendCode.validText }}</span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              @click="handleSubmit(loginForm)" 
              :style = "{ width: '100%' }"
            >
              {{ formType ? '登录' : '注册' }}
            </el-button>
          </el-form-item>
        </el-form>
    </el-card>
  </el-row>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import { UserFilled, Lock } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import { getCode, userAuthentication } from '@/api/index'
  const imgUrl = new URL('@/assets/images/login-head.png', import.meta.url).href

  const loginForm = ref()
  //定义状态，0为注册，1为登录
  const formType = ref(0)
  const handleSwitch = () => {
    formType.value = formType.value === 0 ? 1 : 0
  }
  //定义表单数据
  const formData = ref({
    username: '',
    password: '',
    code: ''
  })

  //定义表单验证规则
  const rules = reactive({
    username: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 4, max: 16, message: '密码长度为4-16位', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9]{4,16}$/, message: '密码只能包含数字、大小写字母', trigger: 'blur' }
    ]
  })

  //发送验证码按钮
  const sendCode = reactive({
    validText: '发送验证码',
    count: 60
  })

  // 添加定时器ID和是否可点击的状态
  let timer = null
  const isSending = ref(false)

  //发送验证码
  const handleSendCode = () => {
    // 如果正在发送中，直接返回
    if (isSending.value) {
      return
    }

    // 手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(formData.value.username)) {
      ElMessage.error('请输入有效的手机号')
      return
    }

    // 设置为正在发送状态
    isSending.value = true
    sendCode.count = 60
    sendCode.validText = `${sendCode.count}秒后重新发送`

    // 清除之前的定时器（如果存在）
    if (timer) {
      clearInterval(timer)
    }

    // 创建新的定时器
    timer = setInterval(() => {
      if (sendCode.count <= 1) {
        // 倒计时结束，清除定时器
        clearInterval(timer)
        timer = null
        // 重置状态
        isSending.value = false
        sendCode.validText = '发送验证码'
        sendCode.count = 60
      } else {
        // 继续倒计时
        sendCode.count--
        sendCode.validText = `${sendCode.count}秒后重新发送`
      }
    }, 1000)

    // 发送验证码请求
    getCode({
      tel: formData.value.username
    }).then(({ data }) => {
      if (data.code === 10000) {
        ElMessage.success('验证码发送成功')
      } else {
        ElMessage.error(data.message || '验证码发送失败')
      }
    }).catch(error => {
      ElMessage.error('网络错误，验证码发送失败')
    })
  }

  //表单提交
  const handleSubmit = async (formRef) => {
    if(!formRef) return
    
    await formRef.validate((valid) => {
      if (valid) {
        if(formType.value === 0){
          //注册
          userAuthentication({
            userName: formData.value.username,
            passWord: formData.value.password,
            validCode: formData.value.code
          }).then(({ data }) => {
            if (data.code === 10000) {
              ElMessage.success('注册成功')
              handleSwitch()
            } else {
              ElMessage.error(data.message.msg )
            }
          }).catch(error => {
            ElMessage.error('网络错误，注册失败')
          })
        }else{
          //登录
        }
      } else {
        ElMessage.error('表单验证失败')
      }
    })
  }
</script>

<style lang="scss" scoped>
:deep(.el-card__header) {
    padding: 0
  }
  .login-container {
    height: 100%;
    .card-header{
      background-color: #899fe1;
      img {
        width: 430px;
      }
    }
    .jump-link {
      text-align: right;
      margin-bottom: 10px;
    }
    
    .send-code-btn {
      color: #409eff;
      cursor: pointer;
      padding: 0 10px;
      user-select: none;
    }

    .send-code-btn:hover {
      color: #66b1ff;
    }

    .send-code-disabled {
      color: #c0c4cc !important;
      cursor: not-allowed !important;
      opacity: 0.7;
    }
  }
</style>