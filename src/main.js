import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
// 引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 引入pinia
const pinia = createPinia()
app.use(pinia)

// 延迟导入store，确保pinia已经初始化
let useSidebarStore = null

// 动态导入store
const importStore = async () => {
  if (!useSidebarStore) {
    const { useSidebarStore: sidebarStore } = await import('./store/sidebar')
    useSidebarStore = sidebarStore
  }
}

//路由守卫
router.beforeEach(async (to, from, next) => {
  // 1. 如果是登录页，直接放行
  if (to.path === '/login') return next()
  // 2. 从本地存储中获取token
  const token = localStorage.getItem('pz_token')
  // 3. 如果token不存在，重定向到登录页
  if (!token) return next('/login')
  
  // 4. 动态导入store
  await importStore()
  
  // 5. 如果token存在，检查是否需要重新获取菜单数据
  const sidebarStore = useSidebarStore()
  
  // 如果菜单数据为空，重新获取
  if (sidebarStore.routerList.length === 0) {
    try {
      // 导入需要的API
      const { menuPermissions } = await import('./api/index')
      
      // 获取菜单数据
      const { data } = await menuPermissions()
      
      if (data.code === 10000) {
        // 动态添加菜单
        sidebarStore.dynamicAddMenu(data.data)
        
        // 将菜单添加到路由
        sidebarStore.routerList.forEach(item => {
          router.addRoute('main', item)
        })
        
        // 重新导航到当前页面，确保路由已生效
        return next({ ...to, replace: true })
      }
    } catch (error) {
      console.error('获取菜单数据失败:', error)
      // 如果获取菜单数据失败，重定向到登录页
      return next('/login')
    }
  }
  
  // 6. 如果用户访问的是根路径'/'，重定向到第一个有权限的菜单
  if (to.path === '/') {
    // 获取用户的第一个有权限的菜单
    const firstMenu = sidebarStore.getFirstPermissionMenu()
    
    if (firstMenu && firstMenu.meta && firstMenu.meta.path) {
      // 导入需要的store
      const { useAddMenuStore } = await import('./store/addmenu')
      const addMenuStore = useAddMenuStore()
      
      // 将第一个菜单添加到顶部菜单栏
      addMenuStore.addMenu(firstMenu)
      
      // 重定向到第一个有权限的菜单
      return next(firstMenu.meta.path)
    }
  }
  
  // 7. 如果菜单数据已存在且不是根路径，直接放行
  next()
})

app.use(router).use(ElementPlus).mount('#app')
