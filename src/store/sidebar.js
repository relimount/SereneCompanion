import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isCollapse = ref(false)

  function toggleCollapse() {
    isCollapse.value = !isCollapse.value
  }
  const sidebarClass = computed(() => {
    return isCollapse.value ? 'sidebar-collapse' : ''
  })
  return { isCollapse, toggleCollapse }
})