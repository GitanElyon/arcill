<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div 
        v-for="note in store.notifications" 
        :key="note.id" 
        class="toast-item"
        :class="note.type"
      >
        <span class="icon" v-if="note.type === 'success'">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </span>
        <span class="icon" v-else-if="note.type === 'error'">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </span>
        <span class="icon" v-else>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </span>
        <span class="message">{{ note.message }}</span>
        <button class="close-btn" @click="store.remove(note.id)">&times;</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '../stores/notifications'
const store = useNotificationStore()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 5%; /* Near Top of screen */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, 0); /* Adjust for own width/height */
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 15px;
  pointer-events: none;
  align-items: center; /* Ensure items trigger center alignment behavior */
}

.toast-item {
  pointer-events: auto;
  min-width: 300px;
  max-width: 90vw;
  padding: 1.2rem 1.5rem;
  border-radius: 8px;
  background: var(--color-background-soft); /* Dark background */
  color: white; /* Light text */
  box-shadow: 0 10px 30px rgba(0,0,0,0.5); /* Deep shadow for impact */
  display: flex;
  align-items: center;
  gap: 15px;
  border-left: 5px solid #ccc; /* Thicker border */
  font-size: 1.05rem;
}

.toast-item.success { border-left-color: #42b883; }
.toast-item.error { border-left-color: #ff4d4d; }
.toast-item.info { border-left-color: #3e8ed0; }

.icon {
  font-weight: bold;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: transparent; /* Remove circle background since we have dark theme */
}

.success .icon { color: #42b883; }
.error .icon { color: #ff4d4d; }
.info .icon { color: #3e8ed0; }

.message {
    flex: 1;
    line-height: 1.4;
}

.close-btn {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #888;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}
.close-btn:hover {
    color: white;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Bouncy effect */
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9); /* Pop up from bottom */
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
</style>
