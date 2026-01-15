import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

export const useSidebarStore = defineStore('sidebar', () => {
  const isCollapse = ref(false)
  const routerList = ref([])
  const activeMenu = ref('') // 当前激活的菜单路径
  const router = useRouter()
  
  // 切换侧边栏折叠状态
  function toggleCollapse() {
    isCollapse.value = !isCollapse.value
  }
  
  // 侧边栏类名
  const sidebarClass = computed(() => {
    return isCollapse.value ? 'sidebar-collapse' : ''
  })

  // 动态添加菜单
  const dynamicAddMenu = (menu) => {
        const modules = import.meta.glob('../views/**/**/*.vue')
        console.log(modules,"动态添加菜单模块")
        function routerSet(router){
            router.forEach(item=>{
                if(!item.children){
                    const url = `../views${item.meta.path}/index.vue`
                    item.component = modules[url]
                }else{
                    routerSet(item.children)
                }
            })
        }
        routerSet(menu)
        routerList.value = menu
    }
    
    // 获取用户的第一个有权限的菜单
    const getFirstPermissionMenu = () => {
        // 递归查找第一个没有子菜单的菜单
        const findFirstMenu = (menus) => {
            for (const menu of menus) {
                // 如果当前菜单没有子菜单，返回该菜单
                if (!menu.children || (Array.isArray(menu.children) && menu.children.length === 0)) {
                    return menu
                }
                
                // 如果有子菜单，递归查找
                const childMenu = findFirstMenu(menu.children)
                if (childMenu) {
                    return childMenu
                }
            }
            return null
        }
        
        return findFirstMenu(routerList.value)
    }
    
  // 更新当前激活的菜单
  const updateActiveMenu = () => {
    const currentPath = router.currentRoute.value.path
    activeMenu.value = currentPath
  }
  
  // 监听路由变化，更新激活菜单
  watch(() => router.currentRoute.value.path, (newPath) => {
    activeMenu.value = newPath
  })
  
  return { 
    isCollapse, 
    toggleCollapse, 
    routerList, 
    dynamicAddMenu, 
    activeMenu, 
    updateActiveMenu,
    getFirstPermissionMenu
  }
})