<template>
  <div class="account-view page-container">
    <h1>Account Settings</h1>
    
    <div class="account-grid">
      <aside class="account-nav">
        <button v-for="tab in tabs" :key="tab.id" 
                :class="{ active: activeTab === tab.id }"
                @click="activeTab = tab.id">
          {{ tab.label }}
        </button>
      </aside>

      <main class="account-content">
        <!-- Profile info -->
        <section v-if="activeTab === 'profile'" class="tab-section">
          <h2>Contact Information</h2>
          <form @submit.prevent="updateAccount">
             <div class="form-group">
               <label>Full Name</label>
               <input type="text" v-model="userStore.account.name">
             </div>
             <div class="form-group">
               <label>Email Address</label>
               <input type="email" v-model="userStore.account.email">
             </div>
             <div class="form-group">
               <label>Address Line 1</label>
               <input type="text" v-model="userStore.account.address">
             </div>
             <div class="form-row">
                 <div class="form-group half">
                     <label>City</label>
                     <input type="text" v-model="userStore.account.city">
                 </div>
                 <div class="form-group half">
                     <label>ZIP</label>
                     <input type="text" v-model="userStore.account.zip">
                 </div>
             </div>
             <div class="form-group">
                 <label>Country</label>
                 <input type="text" v-model="userStore.account.country">
             </div>
             <button type="submit" class="btn-primary">Save Changes</button>
             
             <div class="danger-zone">
                <h3>Danger Zone</h3>
                <button type="button" class="btn-danger" @click="handleDeleteAccount">Delete Account</button>
             </div>
          </form>
        </section>

        <!-- Payment methods -->
        <section v-if="activeTab === 'billing'" class="tab-section">
          <h2>Payment Methods</h2>
          
          <div v-if="!showCardForm" class="card-display">
            <!-- List Saved Cards -->
            <div v-if="userStore.account.savedCards && userStore.account.savedCards.length > 0">
                <div v-for="card in userStore.account.savedCards" :key="card.id" class="mock-card mb-2">
                    <div class="card-chip"></div>
                    <div class="card-number">**** **** **** {{ card.last4 }}</div>
                    <div class="card-name">{{ userStore.account.name }}</div>
                    <div class="card-brand">{{ card.brand }}</div>
                </div>
            </div>
            <div v-else class="no-cards-msg">No saved cards found.</div>

            <button class="btn-secondary mt-4" @click="showCardForm = true">Add New Card</button>
          </div>

          <form v-else @submit.prevent="updateCard" class="card-form">
              <h3>Billing Address</h3>
               <div class="form-group">
                 <label>Name on Card</label>
                 <input type="text" v-model="newCardForm.name" required>
               </div>
               <div class="form-group">
                 <label>Address</label>
                 <input type="text" v-model="newCardForm.address" required>
               </div>
                <div class="form-row">
                    <div class="form-group half">
                        <label>City</label>
                        <input type="text" v-model="newCardForm.city" required>
                    </div>
                    <div class="form-group half">
                        <label>ZIP</label>
                        <input type="text" v-model="newCardForm.zip" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Country</label>
                    <input type="text" v-model="newCardForm.country" required>
                </div>

              <h3>Card Details</h3>
              <div class="form-group">
                  <label>Card Number</label>
                  <input type="text" v-model="newCardForm.number" placeholder="**** **** **** ****" required>
              </div>
              <div class="form-row">
                  <div class="form-group">
                      <label>Expiry</label>
                      <input type="text" v-model="newCardForm.expiry" placeholder="MM/YY" required>
                  </div>
                  <div class="form-group">
                      <label>CVC</label>
                      <input type="text" v-model="newCardForm.cvc" placeholder="123" required>
                  </div>
              </div>
              <div class="action-buttons">
                  <button type="submit" class="btn-primary">Save New Card</button>
                  <button type="button" class="btn-secondary" @click="showCardForm = false">Cancel</button>
              </div>
          </form>
        </section>

        <!-- Security -->
        <section v-if="activeTab === 'security'" class="tab-section">
            <h2>Change Password</h2>
            <form @submit.prevent="updatePassword">
                <div class="form-group">
                    <label>Current Password</label>
                    <input type="password" v-model="passwordForm.current" required>
                </div>
                <div class="form-group">
                    <label>New Password</label>
                    <input type="password" v-model="passwordForm.new" required>
                </div>
                <div class="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" v-model="passwordForm.confirm" required>
                </div>
                <button type="submit" class="btn-primary">Update Password</button>
            </form>
        </section>

        <!-- Preferences -->
        <section v-if="activeTab === 'preferences'" class="tab-section">
          <h2>Preferences</h2>
          <div class="pref-row">
            <label class="checkbox-container">
              <input type="checkbox" v-model="userStore.account.isSubscribed">
              <span class="checkmark"></span>
              Notify me when new paintings are released
            </label>
          </div>
          <p class="hint">Weekly updates on new archaeological reconstructions.</p>
        </section>

        <!-- History -->
        <section v-if="activeTab === 'history'" class="tab-section">
          <h2>Purchase History</h2>
          <div class="history-list">
            <div v-for="(item, idx) in userStore.account.purchaseHistory" :key="idx" class="history-item">
               <div class="history-date">{{ formatDate(item.date) }}</div>
               <div class="history-title">{{ item.title }}</div>
               <div class="history-price">Paid: ${{ item.price }}</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useNotificationStore } from '../stores/notifications'

const userStore = useUserStore()
const notify = useNotificationStore()
const router = useRouter()
const activeTab = ref('profile')
const showCardForm = ref(false)

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'billing', label: 'Billing' },
  { id: 'security', label: 'Security' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'history', label: 'History' }
]

const passwordForm = ref({
    current: '',
    new: '',
    confirm: ''
})

const newCardForm = ref({
    name: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    number: '',
    expiry: '',
    cvc: ''
})

async function updateAccount() {
  await userStore.saveAccount()
  notify.add('success', 'Account details updated successfully.')
}

// function updateCard(e: Event) {
//     const form = e.target as HTMLFormElement
//     const input = form.querySelector('input[type="text"]') as HTMLInputElement
//     if (input.value) {
//         userStore.updateCard(input.value)
//         showCardForm.value = false
//         notify.add('success', 'Payment method updated.')
//     }
// }

async function handleDeleteAccount() {
    if (confirm('Are you certain you want to delete your account? This action cannot be undone.')) {
    await userStore.deleteAccount()
        notify.add('info', 'Account deleted. We are sorry to see you go.')
        router.push('/')
    }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US').format(date)
}

function updateCard() {
  // Mock validation
  if (newCardForm.value.number) {
      userStore.updateCard(newCardForm.value.number)
      notify.add('success', 'New card added successfully')
      showCardForm.value = false
      // Reset form
      newCardForm.value = { name: '', address: '', city: '', zip: '', country: '', number: '', expiry: '', cvc: '' }
  }
}

function updatePassword() {
    if (passwordForm.value.new !== passwordForm.value.confirm) {
        notify.add('error', 'New passwords do not match')
        return
    }
    notify.add('success', 'Password changed successfully')
    passwordForm.value = { current: '', new: '', confirm: '' }
}
</script>

<style scoped src="~/src/assets/css/account-view.css"></style>
