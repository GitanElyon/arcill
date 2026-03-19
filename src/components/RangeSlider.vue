<template>
  <div class="range-slider">
    <div class="slider-track" ref="track">
      <div 
        class="slider-range" 
        :style="{ left: leftPercent + '%', width: widthPercent + '%' }"
      ></div>
      <div 
        class="slider-thumb left" 
        :style="{ left: leftPercent + '%' }"
        @mousedown="startDrag('min')"
        @touchstart.prevent="startDrag('min')"
      ></div>
      <div 
        class="slider-thumb right" 
        :style="{ left: rightPercent + '%' }"
        @mousedown="startDrag('max')"
        @touchstart.prevent="startDrag('max')"
      ></div>
    </div>
    <div class="range-values">
        <span>{{ modelValue.min }}</span>
        <span>{{ modelValue.max }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  min: number
  max: number
  modelValue: { min: number, max: number }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { min: number, max: number }): void
}>()

const track = ref<HTMLElement | null>(null)
let activeThumb: 'min' | 'max' | null = null

const totalRange = computed(() => props.max - props.min)

const leftPercent = computed(() => {
  return ((props.modelValue.min - props.min) / totalRange.value) * 100
})

const rightPercent = computed(() => {
  return ((props.modelValue.max - props.min) / totalRange.value) * 100
})

const widthPercent = computed(() => {
    return rightPercent.value - leftPercent.value
})

function startDrag(thumb: 'min' | 'max') {
  activeThumb = thumb
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('touchend', stopDrag)
}

function onDrag(event: MouseEvent | TouchEvent) {
  if (!activeThumb || !track.value) return

  let clientX: number
  if ('touches' in event) {
      const touch = event.touches[0]
      if (!touch) return
      clientX = touch.clientX
  } else {
      clientX = event.clientX
  }

  const rect = track.value.getBoundingClientRect()
  const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
  
  let newValue = Math.round(props.min + (percent * totalRange.value))

  const newRange = { ...props.modelValue }

  if (activeThumb === 'min') {
    if (newValue > props.modelValue.max) newValue = props.modelValue.max
    newRange.min = newValue
  } else {
    if (newValue < props.modelValue.min) newValue = props.modelValue.min
    newRange.max = newValue
  }
  
  emit('update:modelValue', newRange)
}

function stopDrag() {
  activeThumb = null
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
}
</script>

<style scoped src="~/src/assets/css/range-slider.css"></style>

