<template>
  <div class="image-card">
    <div class="image-wrapper" @click="$emit('buy', image)">
      <img :src="image.imageUrl" :alt="image.title" loading="lazy" />
      <button 
        v-if="userStore.isLoggedIn"
        class="bookmark-btn" 
        :class="{ active: userStore.isBookmarked(image.id) }"
        @click.stop="userStore.toggleBookmark(image.id)"
        title="Bookmark this image"
      >
        <svg class="bookmark-icon" :class="{ filled: userStore.isBookmarked(image.id) }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </div>
    <div class="content">
      <h3>{{ image.title }}</h3>
      <p class="meta">
        <span class="period">{{ image.timePeriod }}</span>
        <span class="country">{{ image.country }}</span>
      </p>
      
      <div class="purchase-actions">
        <button class="buy-btn" @click="$emit('buy', image)">Purchase Options</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageItem } from '../stores/images'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

defineProps<{
  image: ImageItem
}>()

defineEmits<{
  (e: 'buy', image: ImageItem): void
}>()
</script>

<style scoped src="~/src/assets/css/image-card.css"></style>

