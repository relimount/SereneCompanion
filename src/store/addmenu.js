import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAddMenuStore = defineStore('addMenu', () => {
    const selectedMenu = ref([])
    const addMenu = (menu) => {
        // 检查菜单是否已存在
        if (selectedMenu.value.some(item => item.meta.id === menu.meta.id)) {
            return false
        }
        selectedMenu.value.push(menu)
        return true
    }

    const removeMenu = (menuId) => {
        const index = selectedMenu.value.findIndex(item => item.meta.id === menuId)
        if (index === -1) {
            return false
        }
        selectedMenu.value.splice(index, 1)
        return true
    }

    return { selectedMenu, addMenu, removeMenu }
})