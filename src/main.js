import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
// 引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//路由守卫
router.beforeEach((to, from, next) => {
  // 1. 如果是登录页，直接放行
  if (to.path === '/login') return next()
  // 2. 从本地存储中获取token
  const token = localStorage.getItem('pz_token')
  // 3. 如果token不存在，重定向到登录页
  if (!token) return next('/login')
  // 4. 如果token存在，放行
  next()
})

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 引入pinia
const pinia = createPinia()
app.use(pinia)

app.use(router).use(ElementPlus).mount('#app')
