<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from './src/stores/user'
import NotificationToast from './src/components/NotificationToast.vue'
import LoginModal from './src/components/LoginModal.vue'

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
</script>

<template>
  <div class="app-container">
    <NotificationToast />
    <LoginModal v-if="showLoginModal" :initialMode="loginMode" @close="showLoginModal = false" />

    <header>
      <div class="logo-area">
        <NuxtLink to="/" class="site-title">Archaeology Illustrated</NuxtLink>
      </div>

      <div class="nav-wrapper">
        <nav>
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/collections">Collections</NuxtLink>
          <NuxtLink to="/speaking">Speaking</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <NuxtLink to="/faq">FAQ</NuxtLink>
          <NuxtLink to="/contact">Contact</NuxtLink>
          <NuxtLink to="/cart" class="cart-link">
            Cart
            <div v-if="userStore.cart.length > 0" class="cart-badge-counter">{{ userStore.cart.length }}</div>
          </NuxtLink>
        </nav>

        <div class="account-area" v-click-outside="closeMenu">
          <div class="profile-trigger" :class="{ 'is-active': userStore.isLoggedIn }" @click="toggleMenu">
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
                <NuxtLink to="/account" @click="closeMenu">Account Settings</NuxtLink>
                <NuxtLink to="/cart" @click="closeMenu">
                  My Cart
                  <span v-if="userStore.cart.length" class="cart-counter">{{ userStore.cart.length }}</span>
                </NuxtLink>
                <NuxtLink to="/bookmarks" @click="closeMenu">Bookmarks</NuxtLink>
                <hr>
                <button class="auth-btn logout" @click="userStore.logout(); closeMenu();">Log Out</button>
              </template>
              <template v-else>
                <button class="auth-btn secondary" style="background-color: #42b883; color: white; margin: 0 5%; border-radius: 5px;" @click="openLogin('create')">Create Account</button>
                <button class="auth-btn" style="margin-top: 0.5rem" @click="openLogin('login')">Log In</button>
              </template>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <main class="main-content">
      <NuxtPage />
    </main>

    <footer>
      <p>&copy; 2026 Archaeology Illustrated. All rights reserved.</p>
    </footer>
  </div>
</template>

<style src="~/src/assets/css/app-layout.css" scoped></style>
