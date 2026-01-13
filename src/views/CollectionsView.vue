<template>
  <div class="collections-view">
    <div class="header">
      <h1>Historical Image Collections</h1>
      <p>Explore our library of high-resolution archaeological reconstructions.</p>
    </div>

    <div class="layout">
      <!-- Sidebar Filters -->
      <aside class="filters">
        <div class="filter-group">
          <h3>Search</h3>
          <input 
            type="text" 
            v-model="store.searchQuery" 
            placeholder="Search images..."
            class="search-input"
          />
        </div>

        <div class="filter-group">
          <h3>Time Period</h3>
          <CustomDropdown 
            v-model="store.selectedTimePeriod" 
            :options="store.uniqueTimePeriods"
            :hasAllOption="true"
            allOptionLabel="All Periods"
            placeholder="Select Period"
          />
        </div>

        <div class="filter-group">
          <h3>Country</h3>
          <CustomDropdown 
            v-model="store.selectedCountry" 
            :options="store.uniqueCountries"
            :hasAllOption="true"
            allOptionLabel="All Countries"
            placeholder="Select Country"
          />
        </div>

        <div class="filter-group">
          <h3>Year Range</h3>
          <RangeSlider 
            v-if="store.minYear !== store.maxYear"
            :min="store.minYear" 
            :max="store.maxYear" 
            v-model="currentYearRange"
          />
           <div v-else class="loading-slider">Loading range...</div>
          <small class="hint">Filter by historical year</small>
        </div>

        <div class="filter-group">
          <h3>Tags</h3>
          <div class="tag-input-container">
             <div class="tag-input-wrapper" @click="focusTagInput">
                 <span v-for="tag in store.selectedTags" :key="tag" class="tag-chip">
                     {{ tag }}
                     <button @click.stop="removeTag(tag)" class="tag-remove">&times;</button>
                 </span>
                 <input 
                    ref="tagInputRef"
                    type="text" 
                    v-model="tagInput" 
                    @keydown.space.prevent="handleSpace"
                    @keydown.enter.prevent="handleEnter"
                    @keydown.delete="handleDelete"
                    placeholder="Search tags..."
                    class="tag-input-field"
                 />
             </div>
             <div v-if="filteredTagSuggestions.length > 0" class="tag-suggestions">
                 <div 
                    v-for="suggestion in filteredTagSuggestions" 
                    :key="suggestion"
                    class="tag-suggestion-item"
                    @click="addTag(suggestion)"
                 >
                    {{ suggestion }}
                 </div>
             </div>
          </div>
        </div>

        <button @click="resetAll" class="reset-btn" v-if="hasActiveFilters">
          Reset Filters
        </button>
      </aside>

      <!-- Main Content -->
      <main class="gallery">
        <div v-if="store.filteredImages.length === 0" class="no-results">
          <p>No images found matching your criteria.</p>
          <button @click="resetAll">Clear filters</button>
        </div>
        
        <div v-else class="image-grid">
          <ImageCard 
            v-for="image in store.filteredImages" 
            :key="image.id" 
            :image="image"
            @buy="handleBuy"
          />
        </div>
      </main>
    </div>

    <!-- Purchase Modal -->
    <div v-if="selectedImage" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <button class="close-icon" @click="closeModal">&times;</button>
        
        <div class="modal-stack">
            <div class="modal-image-container">
                <img :src="selectedImage.imageUrl" class="large-preview-img" :alt="selectedImage.title" @click="isLightboxOpen = true" />
                <div class="zoom-hint">Click to zoom</div>
            </div>
            
            <div class="modal-content-wrapper">
                <transition name="slide-fade" mode="out-in">
                    <!-- Detail Mode -->
                    <div v-if="!isCheckoutMode" key="details" class="modal-info-section">
                        <h2>{{ selectedImage.title }}</h2>
                        <div class="modal-meta-grid">
                            <div class="meta-main">
                                <p class="description">{{ selectedImage.description }}</p>
                            </div>
                            <div class="meta-details">
                                <div class="meta-row">
                                    <strong>Period:</strong> <span>{{ selectedImage.timePeriod }}</span>
                                </div>
                                <div class="meta-row">
                                    <strong>Location:</strong> <span>{{ selectedImage.country }}</span>
                                </div>
                                <div class="meta-row">
                                    <strong>Year:</strong> <span>{{ selectedImage.year }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="modal-tags">
                            <span v-for="tag in selectedImage.tags" :key="tag" class="modal-tag">#{{ tag }}</span>
                        </div>

                        <div class="purchase-controls">
                            <h3>Select License</h3>
                            <CustomDropdown 
                                v-model="selectedPrice" 
                                :options="selectedImage.prices"
                                placeholder="Choose a license"
                                position="top"
                            >
                                <template #selection="{ label, placeholder }">
                                    <span v-if="selectedPrice">{{ selectedPrice.label }} - ${{ selectedPrice.price }}</span>
                                    <span v-else class="placeholder">{{ placeholder }}</span>
                                </template>
                                <template #option="{ option }">
                                    <div class="price-option-row">
                                        <span>{{ option.label }}</span>
                                        <span class="price-detail">{{ option.resolution }} - ${{ option.price }}</span>
                                    </div>
                                </template>
                            </CustomDropdown>
                            
                            <div class="action-buttons">
                                <button class="btn-primary" @click="enterCheckout">Buy Now</button>
                                <button class="btn-secondary" @click="addToCart">Add to Cart</button>
                            </div>
                        </div>
                    </div>

                    <!-- Checkout Mode -->
                    <div v-else key="checkout" class="checkout-section">
                        <button class="back-link" @click="isCheckoutMode = false">&larr; Back to Details</button>
                        <h2>Checkout</h2>
                        
                        <div class="checkout-summary">
                            <div class="summary-item">
                                <span>{{ selectedImage.title }}</span>
                                <span>{{ selectedPrice?.label }}</span>
                                <strong>${{ selectedPrice?.price }}</strong>
                            </div>
                        </div>

                        <div class="payment-selection">
                            <h3>Payment Method</h3>
                            <div class="payment-options">
                                <label class="payment-option" v-if="userStore.isLoggedIn">
                                    <input type="radio" name="payment" value="card" v-model="paymentMethod">
                                    <div class="payment-label">
                                        <div class="card-icon-placeholder"></div>
                                        <span>Saved Card ({{ userStore.account.cardNumber.slice(-4) || '****' }})</span>
                                    </div>
                                </label>
                                <label class="payment-option">
                                    <input type="radio" name="payment" value="paypal" v-model="paymentMethod">
                                    <div class="payment-label">
                                        <img src="https://www.paypalobjects.com/webstatic/mktg/logo-center/PP_Acceptance_Marks_for_LogoCenter_76x48.png" alt="PayPal" class="paypal-logo-small">
                                        <span>PayPal</span>
                                    </div>
                                </label>
                                <label class="payment-option">
                                    <input type="radio" name="payment" value="new-card" v-model="paymentMethod">
                                    <div class="payment-label">
                                        <div class="plus-icon-placeholder">+</div>
                                        <span>Use a different card</span>
                                    </div>
                                </label>
                            </div>

                            

                            <div v-if="paymentMethod === 'new-card'" class="new-card-form">
                                <h3>Billing Details</h3>
                                <div class="form-group">
                                    <input type="text" v-model="form.cardName" placeholder="Full Name" class="checkout-input">
                                </div>
                                <div class="form-group">
                                    <input type="text" v-model="form.address" placeholder="Address" class="checkout-input">
                                </div>
                                <div class="form-row">
                                    <input type="text" v-model="form.city" placeholder="City" class="checkout-input">
                                    <input type="text" v-model="form.zip" placeholder="ZIP / Postcode" class="checkout-input">
                                </div>
                                <div class="form-group">
                                    <input type="text" v-model="form.country" placeholder="Country" class="checkout-input">
                                </div>

                                <h3>Card Details</h3>
                                <div class="form-group">
                                    <input type="text" v-model="form.cardNumber" placeholder="Card Number" class="checkout-input">
                                </div>
                                <div class="form-row">
                                    <input type="text" v-model="form.expiry" placeholder="MM/YY" class="checkout-input">
                                    <input type="text" v-model="form.cvc" placeholder="CVC" class="checkout-input">
                                </div>
                            </div>

                            <div class="coupon-field-group" style="margin: 1rem 0;">
                                <label style="display:block; margin-bottom: 0.5rem; font-size: 0.9rem;">Promo Code</label>
                                <div v-if="!appliedCoupon" style="display: flex; gap: 0.5rem;">
                                    <input type="text" v-model="couponCode" placeholder="Enter Code" class="checkout-input" style="flex:1" @keyup.enter="applyCoupon">
                                    <button class="btn-secondary" @click="applyCoupon" style="padding: 0.5rem 1rem;">Apply</button>
                                </div>
                                <div v-else class="coupon-success" style="display: flex; justify-content: space-between; align-items: center; background: rgba(66, 184, 131, 0.05); padding: 0.5rem; border-radius: 4px; border: 1px solid #2f855a;;">
                                    <span style="color: #2f855a; font-size: 0.9rem;">Code <b>{{ appliedCoupon }}</b> applied (-${{ discountAmount.toFixed(2) }})</span>
                                    <button @click="removeCoupon" style="background: none; border: none; font-size: 1.2rem; color: #2f855a; cursor: pointer;">&times;</button>
                                </div>
                                <p v-if="couponError" style="color: #e53e3e; font-size: 0.8rem; margin-top: 0.25rem;">{{ couponError }}</p>
                            </div>
                        </div>

                        <div class="final-actions">
                                <div v-if="discountAmount > 0" style="margin-bottom: 0.5rem; display: flex; justify-content: space-between; font-size: 0.9rem;">
                                    <span>Original: ${{ selectedPrice?.price }}</span>
                                    <span style="color: #2f855a; font-weight: bold;">Total: ${{ finalPrice.toFixed(2) }}</span>
                                </div>
                                <button class="btn-primary full-width" @click="completePurchase" :disabled="isProcessing">
                                    {{ isProcessing ? 'Processing...' : `Confirm Purchase ($${finalPrice.toFixed(2)})` }}
                                </button>
                            <p class="secure-text">Secure SSL encrypted transaction</p>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
      </div>
    </div>

    <!-- Full Screen Lightbox -->
    <div v-if="isLightboxOpen && selectedImage" class="lightbox-overlay" @click="isLightboxOpen = false">
        <button class="lightbox-close">&times;</button>
        <img :src="selectedImage.imageUrl" class="lightbox-img" :alt="selectedImage.title" @click.stop />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useImageStore, type ImageItem, type ImagePrice } from '../stores/images'
import { useUserStore } from '../stores/user'
import { useNotificationStore } from '../stores/notifications'
import ImageCard from '../components/ImageCard.vue'
import CustomDropdown from '../components/CustomDropdown.vue'
import RangeSlider from '../components/RangeSlider.vue'

const store = useImageStore()
const userStore = useUserStore()
const notificationStore = useNotificationStore()
const route = useRoute()
const router = useRouter()

const selectedImage = ref<ImageItem | null>(null)
const selectedPrice = ref<ImagePrice | null>(null)
const isCheckoutMode = ref(false)
const isProcessing = ref(false)
const paymentMethod = ref(userStore.isLoggedIn ? 'card' : 'new-card')

const form = reactive({
    cardName: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
})

const couponCode = ref('')
const appliedCoupon = ref('')
const discountAmount = ref(0)
const couponError = ref('')

const finalPrice = computed(() => {
    if (!selectedPrice.value) return 0
    return Math.max(0, selectedPrice.value.price - discountAmount.value)
})

function applyCoupon() {
    couponError.value = ''
    if (!couponCode.value || !selectedPrice.value) return

    if (couponCode.value.toUpperCase() === 'SAVE10') {
        appliedCoupon.value = 'SAVE10'
        discountAmount.value = selectedPrice.value.price * 0.10 // 10%
    } else if (couponCode.value.toUpperCase() === 'MINUS5') {
        appliedCoupon.value = 'MINUS5'
        discountAmount.value = 5
    } else {
        couponError.value = 'Invalid code'
        discountAmount.value = 0
        appliedCoupon.value = ''
    }
}

function removeCoupon() {
    appliedCoupon.value = ''
    couponCode.value = ''
    discountAmount.value = 0
    couponError.value = ''
}

watch(selectedPrice, () => {
     if (appliedCoupon.value) {
         applyCoupon() 
     }
})

onMounted(() => {
    const buyId = route.query.buy as string
    if (buyId) {
        const image = store.images.find(img => img.id === buyId)
        if (image) {
            handleBuy(image)
        }
    }
})

watch(() => route.query.buy, (newId) => {
    if (newId) {
        const image = store.images.find(img => img.id === newId)
        if (image) {
            handleBuy(image)
        }
    }
})

// Tag filter logic
const tagInput = ref('')
const tagInputRef = ref<HTMLInputElement | null>(null)

const filteredTagSuggestions = computed(() => {
    if (!tagInput.value) return []
    const input = tagInput.value.toLowerCase()
    return store.uniqueTags.filter(tag => 
        tag.toLowerCase().includes(input) && 
        !store.selectedTags.includes(tag)
    ).slice(0, 5) // Limit suggestions
})

function focusTagInput() {
    tagInputRef.value?.focus()
}

function handleSpace() {
    const suggestion = filteredTagSuggestions.value[0]
    if (suggestion) {
        addTag(suggestion)
    } else {
        const val = tagInput.value.trim()
        if (val) addTag(val)
    }
}

function handleEnter() {
    const suggestion = filteredTagSuggestions.value[0]
    if (suggestion) {
        addTag(suggestion)
    } else {
        const val = tagInput.value.trim()
        if (val) addTag(val)
    }
}

function handleDelete(e: KeyboardEvent) {
    if (!tagInput.value && store.selectedTags.length > 0) {
        store.selectedTags.pop()
    }
}

function addTag(tag: string) {
    if (!store.selectedTags.includes(tag)) {
        store.selectedTags.push(tag)
    }
    tagInput.value = ''
}

function removeTag(tag: string) {
    store.selectedTags = store.selectedTags.filter(t => t !== tag)
}

function handleTagInput(e: Event) {
    // Just for v-model triggers
}

// Year Range Logic
const currentYearRange = computed({
    get: () => ({ 
        min: store.yearRange.min ?? store.minYear, 
        max: store.yearRange.max ?? store.maxYear 
    }),
    set: (val) => {
        store.yearRange.min = val.min
        store.yearRange.max = val.max
    }
})

// Initialize store range if not set
if (store.yearRange.min === null) store.yearRange.min = store.minYear
if (store.yearRange.max === null) store.yearRange.max = store.maxYear

const hasActiveFilters = computed(() => {
  return store.searchQuery !== '' || 
         store.selectedTimePeriod !== '' || 
         store.selectedCountry !== '' ||
         store.selectedTags.length > 0
})

function resetAll() {
    store.resetFilters()
    store.yearRange.min = store.minYear
    store.yearRange.max = store.maxYear
}

function handleBuy(image: ImageItem) {
  selectedImage.value = image
  // Default to Large Web (2000x1200) which is typically index 1, or fallback to first
  const preferredPrice = image.prices.find(p => p.resolution === '2000x1200')
  selectedPrice.value = preferredPrice || image.prices[0] || null
  isCheckoutMode.value = false
}

function closeModal() {
  selectedImage.value = null
  selectedPrice.value = null
  isCheckoutMode.value = false
  // Remove query param without reload
  const newQuery = { ...route.query }
  delete newQuery.buy
  router.replace({ query: newQuery })
}

const isLightboxOpen = ref(false)

function enterCheckout() {
    if (!selectedPrice.value) {
        notificationStore.add('error', 'Please select a license first')
        return
    }
    isCheckoutMode.value = true
    paymentMethod.value = userStore.isLoggedIn ? 'card' : 'new-card'
}

async function completePurchase() {
    if (!selectedImage.value || !selectedPrice.value) return
    
    isProcessing.value = true
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    notificationStore.add('success', `Success! Your purchase of ${selectedImage.value.title} is complete.`)
    
    isProcessing.value = false
    closeModal()
}

function addToCart() {
    if (!selectedImage.value || !selectedPrice.value) return
    userStore.addToCart(selectedImage.value, selectedPrice.value)
    notificationStore.add('success', `Added ${selectedImage.value.title} to cart!`)
    closeModal()
}
</script>

<style scoped src="@/assets/css/collections-view.css"></style>

