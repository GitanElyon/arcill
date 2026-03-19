import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click-outside', {
    mounted(el: HTMLElement, binding: { value: () => void }) {
      const clickOutsideEvent = (event: Event) => {
        const target = event.target as Node | null
        if (target && !(el === target || el.contains(target))) {
          binding.value()
        }
      }

      ;(el as HTMLElement & { __clickOutsideEvent?: (event: Event) => void }).__clickOutsideEvent = clickOutsideEvent
      document.body.addEventListener('click', clickOutsideEvent)
    },
    unmounted(el: HTMLElement) {
      const element = el as HTMLElement & { __clickOutsideEvent?: (event: Event) => void }
      if (element.__clickOutsideEvent) {
        document.body.removeEventListener('click', element.__clickOutsideEvent)
      }
    },
    getSSRProps() {
      return {}
    },
  })
})
