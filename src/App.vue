<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from './stores/user'
import NotificationToast from './components/NotificationToast.vue'
import LoginModal from './components/LoginModal.vue'

const userStore = useUserStore()
const isMenuOpen = ref(false)
const showLoginModal = ref(false)
const loginMode = ref<'login' | 'create'>('login')

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

function openLogin(mode: 'login' | 'create' = 'login') {
  loginMode.value = mode
  showLoginModal.value = true
  closeMenu()
}

// Click outside handled by a simple directive or just @click.stop
</script>

<template>
  <div class="app-container">
    <NotificationToast />
    <LoginModal v-if="showLoginModal" @close="showLoginModal = false" :initialMode="loginMode" />
    
    <header>
      <div class="logo-area">
        <RouterLink to="/" class="site-title">Archaeology Illustrated</RouterLink>
      </div>

      <div class="nav-wrapper">
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/collections">Collections</RouterLink>
          <RouterLink to="/speaking">Speaking</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/faq">FAQ</RouterLink>
          <RouterLink to="/contact">Contact</RouterLink>
          <RouterLink to="/cart" class="cart-link">Cart<div v-if="userStore.cart.length > 0" class="cart-badge-counter">{{ userStore.cart.length }}</div></RouterLink>
          
        </nav>

        <div class="account-area" v-click-outside="closeMenu">
          <div class="profile-trigger" @click="toggleMenu" :class="{ 'is-active': userStore.isLoggedIn }">
            <svg class="profile-icon outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
            
          </div>
          
          <transition name="dropdown-fade">
            <div v-if="isMenuOpen" class="account-dropdown">
              <template v-if="userStore.isLoggedIn">
                <div class="dropdown-header">
                  <strong>{{ userStore.account.name }}</strong>
                </div>
                <hr>
                <RouterLink to="/account" @click="closeMenu">Account Settings</RouterLink>
                <RouterLink to="/cart" @click="closeMenu">
                  My Cart 
                  <span v-if="userStore.cart.length" class="cart-counter">{{ userStore.cart.length }}</span>
                </RouterLink>
                <RouterLink to="/bookmarks" @click="closeMenu">Bookmarks</RouterLink>
                <hr>
                <button @click="userStore.logout(); closeMenu();" class="auth-btn logout">Log Out</button>
              </template>
              <template v-else>
                <button @click="openLogin('create')" class="auth-btn secondary" style="background-color: #42b883; color: white; margin: 0 5%; border-radius: 5px;">Create Account</button>
                 <button @click="openLogin('login')" class="auth-btn" style="margin-top: 0.5rem">Log In</button>
              </template>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <main class="main-content">
      <RouterView />
    </main>

    <footer>
      <p>&copy; 2026 Archaeology Illustrated. All rights reserved.</p>
    </footer>
  </div>
</template>

<script lang="ts">
// Simple click outside directive
export default {
    directives: {
        'click-outside': {
            mounted(el: any, binding: any) {
                el.clickOutsideEvent = (event: Event) => {
                    if (!(el === event.target || el.contains(event.target))) {
                        binding.value();
                    }
                };
                document.body.addEventListener('click', el.clickOutsideEvent);
            },
            unmounted(el: any) {
                document.body.removeEventListener('click', el.clickOutsideEvent);
            }
        }
    }
}
</script>

<style>
/* Global resets or base styles are in main.css */
</style>

<style scoped src="@/assets/css/app-layout.css"></style>

