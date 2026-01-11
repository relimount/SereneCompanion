<template>
  <el-header>
    <div class="header-content">
      <!-- 左侧折叠按钮+已选菜单 -->
      <div class="header-left flex-box">
        <el-icon class="header-icon" size="20" @click="toggleSidebar">
          <Fold />
        </el-icon>
        <ul class="selected-menu flex-box">
          <li v-for="item in selectedMenu" :key="item.meta.id" @click="navigateToPage(item)">
            <el-icon class="icon-menu" size="12">
              <component :is="item.meta.icon" />
            </el-icon>
            {{ item.meta.name }}
            <el-icon class="close-icon" size="12" @click.stop="removeSelectedMenu(item)">
              <Close />
            </el-icon>
          </li>
        </ul>
      </div>
      <!-- 右侧头像、用户名+登出 -->
      <div class="header-right flex-box">
        <el-dropdown>
    <span class="el-dropdown-link flex-box">
      <el-avatar
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      />
      <p class="username">用户名</p>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { useSidebarStore } from '@/store/sidebar'
import { useAddMenuStore } from '@/store/addmenu'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const sidebarStore = useSidebarStore()
const addMenuStore = useAddMenuStore()
const router = useRouter()

// 已选菜单
const selectedMenu = computed(() => {
  return addMenuStore.selectedMenu
})

// 折叠/展开侧边栏
const toggleSidebar = () => {
  sidebarStore.toggleCollapse()
}
// 导航到对应页面
const navigateToPage = (item) => {
  router.push(item.meta.path)
}

// 移除已选菜单
const removeSelectedMenu = (item) => {
  // 获取当前路由路径
  const currentPath = router.currentRoute.value.path
  
  // 获取当前已选菜单列表
  const menuList = addMenuStore.selectedMenu
  
  // 找到被移除菜单的索引
  const currentIndex = menuList.findIndex(menu => menu.meta.id === item.meta.id)
  
  // 判断是否需要导航
  let needNavigate = false
  let targetPath = '/dashboard' // 默认导航路径
  
  // 如果当前页面就是要关闭的页面
  if (currentPath === item.meta.path) {
    needNavigate = true
    
    // 确定目标页面
    if (menuList.length > 1) {
      // 如果不是最后一个菜单，导航到后一个菜单
      if (currentIndex < menuList.length - 1) {
        targetPath = menuList[currentIndex + 1].meta.path
      } else {
        // 如果是最后一个菜单，导航到前一个菜单
        targetPath = menuList[currentIndex - 1].meta.path
      }
    }
  }
  
  // 移除菜单
  addMenuStore.removeMenu(item.meta.id)
  
  // 如果需要导航，执行导航
  if (needNavigate) {
    router.push(targetPath)
  }
}
</script>

<style lang="scss" scoped>
.flex-box{
    display: flex;
    align-items: center;
}
.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height:100%;
    background-color: #fff;
    padding-right: 25px;
    .header-left{
        height: 100%;
        .header-icon{
            width: 45px;
            height: 100%;
        }
        .header-icon:hover{
            background-color: #f5f5f5;
            cursor: pointer;
        }
        .selected-menu{
            height: 100%;
            li{
                height: 100%;
                line-height: 45px;
                padding: 0 10px;
                background-color: #fff;
                cursor: pointer;

                .close-icon{
                    margin-left: 5px;
                    visibility: hidden;
                }
                &:hover{
                  background-color: #f5f5f5;
                  cursor: pointer;
                  color: #2683ed;
                    .close-icon{
                        visibility: visible;
                        cursor: pointer;
                    }
                }
            }
            
        }
    }
    .header-right{
        height: 100%;
        .username{
            margin-left: 10px;
        }
    }
}
</style>