<template>
  <div class="custom-dropdown" :class="{ 'is-open': isOpen, 'pos-top': position === 'top' }" v-click-outside="close">
    <div class="selected-option" @click="toggle" :class="{ 'placeholder': !modelValue }">
      <slot name="selection" :label="selectedLabel" :placeholder="placeholder">
        {{ selectedLabel || placeholder }}
      </slot>
      <span class="arrow">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </span>
    </div>
    <transition :name="position === 'top' ? 'dropdown-slide-up' : 'dropdown-slide'">
      <ul v-show="isOpen" class="options-list">
        <li 
            v-if="hasAllOption"
            class="option-item" 
            @click="select(allOptionValue)"
            :class="{ 'selected': modelValue === allOptionValue }"
        >
            {{ allOptionLabel }}
        </li>
        <li 
          v-for="option in options" 
          :key="getOptionKey(option)" 
          class="option-item"
          :class="{ 'selected': isSelected(option) }"
          @click="select(option)"
        >
          <slot name="option" :option="option">
             {{ getOptionLabel(option) }}
          </slot>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: any
  options: any[]
  placeholder?: string
  labelKey?: string
  valueKey?: string
  hasAllOption?: boolean
  allOptionLabel?: string
  allOptionValue?: string | number | null
  position?: 'top' | 'bottom'
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const allOptionLabel = props.allOptionLabel || 'All'
const allOptionValue = props.allOptionValue !== undefined ? props.allOptionValue : ''

const selectedLabel = computed(() => {
    if (props.hasAllOption && props.modelValue === allOptionValue) {
        return allOptionLabel
    }

    if (!props.modelValue && props.modelValue !== 0) return ''
    
    // Find selected option
    const selected = props.options.find(opt => {
        const val = props.valueKey ? opt[props.valueKey] : opt
        return val === props.modelValue
    })

    if (!selected) return ''
    
    return props.labelKey ? selected[props.labelKey] : selected
})

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function select(option: any) {
  if (props.hasAllOption && option === allOptionValue) {
      emit('update:modelValue', allOptionValue)
      close()
      return
  }

  const value = props.valueKey ? option[props.valueKey] : option
  emit('update:modelValue', value)
  close()
}

function isSelected(option: any) {
    const value = props.valueKey ? option[props.valueKey] : option
    return props.modelValue === value
}

function getOptionKey(option: any) {
    return props.valueKey ? option[props.valueKey] : option
}

function getOptionLabel(option: any) {
    return props.labelKey ? option[props.labelKey] : option
}

// Click outside directive
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = function(event: Event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped src="~/src/assets/css/custom-dropdown.css"></style>

