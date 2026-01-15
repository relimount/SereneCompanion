import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAddMenuStore = defineStore('addMenu', () => {
    // 本地存储键名
    const STORAGE_KEY = 'pz_selected_menu'
    
    // 从本地存储中恢复数据，如果没有则使用空数组
    const restoreSelectedMenu = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                return JSON.parse(stored)
            }
        } catch (error) {
            console.error('从本地存储恢复已选菜单失败:', error)
        }
        return []
    }
    
    // 初始化selectedMenu，从本地存储中恢复数据
    const selectedMenu = ref(restoreSelectedMenu())
    
    // 监听selectedMenu的变化，持久化到本地存储
    watch(selectedMenu, (newValue) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue))
            console.log('已选菜单已持久化到本地存储')
        } catch (error) {
            console.error('已选菜单持久化到本地存储失败:', error)
        }
    }, { deep: true })
    
    const addMenu = (menu) => {
        // 添加详细调试信息
        console.log('尝试添加的菜单:', menu.name, 'ID:', menu.meta.id)
        console.log('当前已选菜单:', selectedMenu.value.map(item => `${item.name} (ID: ${item.meta.id})`))
        
        // 检查菜单是否已存在 - 使用name而不是meta.id，因为name是唯一的路由名称
        const isExist = selectedMenu.value.some(item => item.name === menu.name)
        
        if (isExist) {
            console.log('菜单已存在，无法添加')
            return false
        }
        
        // 确保只有没有子菜单的菜单项才能被添加到selectedMenu中
        const hasChildren = Array.isArray(menu.children) && menu.children.length > 0
        
        if (!hasChildren) {
            selectedMenu.value.push(menu)
            console.log('菜单添加成功')
            return true
        }
        
        console.log('菜单有子菜单，无法添加')
        return false
    }

    const removeMenu = (menuId) => {
        // 添加详细调试信息
        console.log('尝试移除的菜单ID:', menuId)
        
        // 先尝试使用name查找（如果menuId实际上是name）
        let index = selectedMenu.value.findIndex(item => item.name === menuId)
        
        // 如果没有找到，再尝试使用meta.id查找
        if (index === -1) {
            index = selectedMenu.value.findIndex(item => item.meta.id === menuId)
        }
        
        if (index === -1) {
            console.log('菜单不存在，无法移除')
            return false
        }
        
        console.log('移除菜单:', selectedMenu.value[index].name, '(ID:', selectedMenu.value[index].meta.id, ')')
        selectedMenu.value.splice(index, 1)
        console.log('移除后已选菜单:', selectedMenu.value.map(item => `${item.name} (ID: ${item.meta.id})`))
        return true
    }

    // 清空已选菜单
    const clearSelectedMenu = () => {
        selectedMenu.value = []
        return true
    }

    return { selectedMenu, addMenu, removeMenu, clearSelectedMenu}
})