<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useImageStore } from '../stores/images'
import ImageCard from '../components/ImageCard.vue'

const store = useImageStore()
</script>

<template>
  <main class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>Reconstructing the Ancient World</h1>
        <p>Premium Historical Reconstructions & Archaeological Illustrations</p>
        <RouterLink to="/collections" class="cta-button">Browse Collection</RouterLink>
      </div>
    </section>

    <!-- Popular Works -->
    <section class="section-container">
        <div class="section-header">
            <h2>Popular Works</h2>
            <RouterLink to="/collections">View All &rarr;</RouterLink>
        </div>
        <div class="grid-layout">
             <ImageCard 
                v-for="image in store.popularImages" 
                :key="image.id" 
                :image="image"
                @buy="() => {}"
            />
        </div>
    </section>

     <!-- Recent Works -->
    <section class="section-container bg-light">
        <div class="section-header">
            <h2>Recently Added</h2>
            <RouterLink to="/collections">View All &rarr;</RouterLink>
        </div>
        <div class="grid-layout">
             <ImageCard 
                v-for="image in store.recentImages" 
                :key="image.id" 
                :image="image"
                @buy="() => {}"
            />
        </div>
    </section>

    <!-- Popular Tags -->
    <section class="section-container">
        <div class="section-header">
            <h2>Explore by Tag</h2>
        </div>
        <div class="tags-cloud">
            <span v-for="tag in store.popularTags" :key="tag" class="tag-pill">
                #{{ tag }}
            </span>
        </div>
    </section>
  </main>
</template>

<style scoped src="@/assets/css/home-view.css"></style>
