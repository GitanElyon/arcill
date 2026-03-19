<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="login-card">
      <button class="close-btn" @click="$emit('close')">&times;</button>
      <h2>{{ isRegister ? 'Create Account' : 'Welcome Back' }}</h2>
      <p class="subtitle">{{ isRegister ? 'Join our community to collect history' : 'Log in to manage your collections' }}</p>
      
      <form @submit.prevent="handleSubmit">
        <div v-if="isRegister" class="form-group">
          <label>Full Name</label>
          <input type="text" v-model="name" placeholder="John Doe" required>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="email@example.com" required>
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" placeholder="••••••••" required>
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Log In') }}
        </button>

        <div class="toggle-auth">
            <span v-if="isRegister">Already have an account? <a href="#" @click.prevent="isRegister = false">Log In</a></span>
            <span v-else>Don't have an account? <a href="#" @click.prevent="isRegister = true">Create Account</a></span>
        </div>
      </form>

      <p class="guest-hint" v-if="!isRegister">Try: balage@archaeologyillustrated.com / password</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { useNotificationStore } from '../stores/notifications'

const props = defineProps<{
    initialMode?: 'login' | 'create'
}>()

const emit = defineEmits(['close'])
const userStore = useUserStore()
const notify = useNotificationStore()

const isRegister = ref(props.initialMode === 'create')
const name = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)

watch(() => props.initialMode, (newMode) => {
    if (newMode) {
        isRegister.value = newMode === 'create'
    }
})

async function handleSubmit() {
  isLoading.value = true
  
  try {
    await userStore.login({
      email: email.value,
      name: isRegister.value ? name.value : undefined,
    })

    if (isRegister.value) {
      notify.add('success', `Account created! Welcome, ${userStore.account.name}!`)
    } else {
      notify.add('success', `Welcome back, ${userStore.account.name}!`)
    }

    emit('close')
  } catch {
    notify.add('error', 'Unable to authenticate right now. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.toggle-auth {
    margin-top: 1rem;
    text-align: center;
    font-size: 0.9rem;
}

.toggle-auth a {
    color: #42b883;
    font-weight: bold;
    text-decoration: none;
}

.toggle-auth a:hover {
    text-decoration: underline;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.login-card {
  background: var(--color-background, white);
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  color: var(--color-text);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #888;
}

h2 {
  margin: 0 0 0.5rem;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #888;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--color-border, #ddd);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--color-background-soft, #f8f8f8);
  color: var(--color-text);
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.login-btn:hover:not(:disabled) {
  background-color: #3aa876;
}

.guest-hint {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.8rem;
  color: #888;
}
</style>
