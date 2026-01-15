import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAddMenuStore = defineStore('addMenu', () => {
    const selectedMenu = ref([])
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