<template>
  <div class="bookmarks-view page-container">
    <h1>Your Bookmarks</h1>
    
    <div v-if="bookmarkedImages.length === 0" class="empty-state">
      <p>You haven't bookmarked any images yet.</p>
      <RouterLink to="/collections" class="btn-primary">Explore Gallery</RouterLink>
    </div>

    <div v-else class="image-grid">
      <ImageCard 
        v-for="image in bookmarkedImages" 
        :key="image.id" 
        :image="image"
        @buy="handleBuy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useImageStore, type ImageItem } from '../stores/images'
import ImageCard from '../components/ImageCard.vue'

const userStore = useUserStore()
const imageStore = useImageStore()
const router = useRouter()

const bookmarkedImages = computed(() => {
  return imageStore.images.filter(img => userStore.bookmarks.includes(img.id))
})

function handleBuy(image: ImageItem) {
  router.push({ path: '/collections', query: { buy: image.id } })
}
</script>

<style scoped src="~/src/assets/css/bookmarks-view.css"></style>
