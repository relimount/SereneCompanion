import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isCollapse = ref(false)
  const routerList = ref([])
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
  return { isCollapse, toggleCollapse, routerList, dynamicAddMenu }
})