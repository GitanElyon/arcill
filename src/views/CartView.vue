<template>
  <div class="cart-view page-container">
    <h1>Shopping Cart</h1>
    
    <div v-if="userStore.cart.length === 0" class="empty-cart">
      <p>Your cart is currently empty.</p>
      <RouterLink to="/collections" class="btn-primary">Browse Collections</RouterLink>
    </div>

    <div v-else class="cart-layout">
      <div class="cart-items">
        <div v-for="(item, index) in userStore.cart" :key="index" class="cart-item">
          <img :src="item.image.imageUrl" :alt="item.image.title" class="item-img">
          <div class="item-info">
            <h3>{{ item.image.title }}</h3>
            <div class="cart-price-selector">
                <CustomDropdown 
                    :modelValue="item.price" 
                    @update:modelValue="(val) => updateItemPrice(index, val)"
                    :options="item.image.prices"
                    placeholder="Select License"
                >
                    <template #selection="{ label }">
                        <span>{{ label ? label.label + ' (' + label.resolution + ')' : 'Select License' }}</span>
                    </template>
                    <template #option="{ option }">
                        <div style="display: flex; justify-content: space-between; width: 100%;">
                            <span>{{ option.label }}</span>
                            <span>${{ option.price }}</span>
                        </div>
                    </template>
                </CustomDropdown>
            </div>
          </div>
          <div class="item-price">${{ item.price.price }}</div>
          <button @click="userStore.removeFromCart(index)" class="remove-btn">&times;</button>
        </div>
      </div>

      <aside class="cart-summary">
        <h2>Summary</h2>
        
        <div class="summary-items-list" v-if="userStore.cart.length > 0">
             <div v-for="(item, idx) in userStore.cart" :key="idx" class="summary-item-row">
                 <span class="s-item-name">{{ item.image.title }}</span>
                 <span class="s-item-price">${{ item.price.price }}</span>
             </div>
             
        </div>

        <div class="summary-row">
          <span>Subtotal</span>
          <span>${{ userStore.cartTotal }}</span>
        </div>

        <div class="coupon-section">
            
            <p v-if="couponError" class="error-text">{{ couponError }}</p>
             <div v-if="discountAmount > 0" class="summary-row discount">
                <span>Discount</span>
                <span>-${{ discountAmount.toFixed(2) }}</span>
            </div>
        </div>

        <div class="summary-row total">
          <span>Total</span>
          <span>${{ finalTotal.toFixed(2) }}</span>
        </div>
        <div v-if="!appliedCoupon" class="coupon-input-group">
                <input 
                    type="text" 
                    v-model="couponCode" 
                    placeholder="Enter Promo Code" 
                    class="coupon-input"
                    @keyup.enter="applyCoupon"
                >
                <button @click="applyCoupon" class="btn-small">Apply</button>
            </div>
            <div v-else class="coupon-applied">
                <span class="success-text">Code: <strong>{{ appliedCoupon }}</strong></span>
                <button @click="removeCoupon" class="remove-coupon-btn">&times;</button>
            </div>
        <button class="checkout-btn" @click="startCheckout">Proceed to Checkout</button>
      </aside>
    </div>

    <section class="suggestions" v-if="suggestedImages.length">
      <hr>
      <h2>You might also like (15% Subscriber Discount)</h2>
      <div class="suggestion-grid">
        <div v-for="image in suggestedImages" :key="image.id" class="suggestion-card">
          <img :src="image.imageUrl" :alt="image.title">
          <div class="suggestion-info">
            <h4>{{ image.title }}</h4>
            <div class="discount-price">
               <span class="original-price">${{ (image.prices?.[0]?.price ?? 0).toFixed(2) }}</span>
               <span class="new-price">${{ ((image.prices?.[0]?.price ?? 0) * 0.85).toFixed(2) }}</span>
            </div>
            <button class="btn-small" @click="handleSugBuy(image)">View</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Checkout Modal -->
    <div v-if="showCheckout" class="modal-backdrop" @click.self="showCheckout = false">
      <div class="modal-content">
        <button class="close-btn" @click="showCheckout = false">&times;</button>
        <div class="checkout-box">
            <h2>Secure Checkout</h2>
            
                <div class="checkout-steps">
                    <div class="payment-selection">
                    <h3>Payment Method</h3>
                    <div class="payment-options-col">
                        <label class="pay-opt" v-if="userStore.isLoggedIn">
                            <input type="radio" name="c-payment" value="card" v-model="paymentMethod">
                            <div class="pay-label">
                                <div class="card-icon-placeholder"></div>
                                <span>Saved Card ({{ userStore.account.cardNumber.slice(-4) || '****' }})</span>
                            </div>
                        </label>
                        <label class="pay-opt">
                            <input type="radio" name="c-payment" value="paypal" v-model="paymentMethod">
                            <div class="pay-label">
                                <img src="https://www.paypalobjects.com/webstatic/mktg/logo-center/PP_Acceptance_Marks_for_LogoCenter_76x48.png" alt="PayPal" height="20">
                                <span>PayPal</span>
                            </div>
                        </label>
                        <label class="pay-opt">
                            <input type="radio" name="c-payment" value="new-card" v-model="paymentMethod">
                            <div class="pay-label">
                                <div class="plus-icon-placeholder">+</div>
                                <span>Use a different card</span>
                            </div>
                        </label>
                    </div>


                </div>
            </div>

          <form v-if="paymentMethod === 'new-card'" @submit.prevent="processPayment" class="checkout-form">
            <div class="form-section">
              <h3>Billing Details</h3>
              <div class="form-group">
                  <label>Full Name</label>
                  <input type="text" v-model="form.cardName" required placeholder="John Doe">
              </div>
              <div class="form-group">
                  <label>Address</label>
                  <input type="text" v-model="form.address" required placeholder="123 Street Name">
              </div>
              <div class="form-row">
                  <div class="form-group half">
                      <label>City</label>
                      <input type="text" v-model="form.city" required placeholder="City">
                  </div>
                  <div class="form-group half">
                      <label>ZIP / Postcode</label>
                      <input type="text" v-model="form.zip" required placeholder="ZIP">
                  </div>
              </div>
              <div class="form-group">
                   <label>Country</label>
                   <input type="text" v-model="form.country" required placeholder="Country">
              </div>

              <h3>Card Details</h3>
              <div class="form-group">
                <label>Card Number</label>
                <input type="text" v-model="form.cardNumber" required placeholder="0000 0000 0000 0000" maxlength="19">
              </div>

              <div class="form-row">
                <div class="form-group half">
                  <label>Expiry Date</label>
                  <input type="text" v-model="form.expiry" required placeholder="MM/YY" maxlength="5">
                </div>
                <div class="form-group half">
                  <label>CVC</label>
                  <input type="text" v-model="form.cvc" required placeholder="123" maxlength="4">
                </div>
              </div>
            </div>
          </form>

            <div class="checkout-footer">
                
                

                <div class="checkout-summary">
                    <div class="checkout-items-preview">
                    <div v-for="(item, idx) in userStore.cart" :key="idx" style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.25rem;">
                        <span style="color: #888;">{{ item.image.title }}</span>
                        <span style="font-weight: 500;">${{ item.price.price }}</span>
                    </div>
                </div>
                    <div v-if="discountAmount > 0" class="summary-item" style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; color: #888;">
                       <span>Subtotal</span>
                       <span>${{ userStore.cartTotal }}</span>
                   </div>
                   <div v-if="discountAmount > 0" class="summary-item discount" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #047461;">
                       <span>Discount</span>
                       <span>-${{ discountAmount.toFixed(2) }}</span>
                   </div>

                   <div class="summary-item total">
                       <span>Total</span>
                       <span class="amount">${{ finalTotal.toFixed(2) }}</span>
                   </div>
                </div>

                <div class="checkout-coupon-section" style="margin-top: 1.5rem;">
                        <div v-if="!appliedCoupon" class="coupon-input-group" style="display: flex; gap: 0.5rem;">
                            <input 
                                type="text" 
                                v-model="couponCode" 
                                placeholder="Enter Promo Code" 
                                class="coupon-input"
                                style="flex: 1; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;"
                                @keyup.enter="applyCoupon"
                            >
                            <button @click="applyCoupon" class="btn-small">Apply</button>
                        </div>
                         <div v-else class="coupon-applied" style="display: flex; align-items: center; justify-content: space-between; background: rgba(66, 184, 131, 0.2); padding: 0.5rem; border-radius: 4px; color: #047461;">
                             <span>Saved ${{ discountAmount.toFixed(2) }} with <strong>{{ appliedCoupon }}</strong></span>
                             <button @click="removeCoupon" class="remove-coupon-btn" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #047461;">&times;</button>
                        </div>
                        <p v-if="couponError" class="error-text" style="color: #e53e3e; font-size: 0.85rem; margin-top: 0.25rem;">{{ couponError }}</p>
                    </div>

                <button class="pay-btn btn-primary" @click="processPayment" :disabled="isProcessing">
                    {{ isProcessing ? 'Processing Payment...' : `Confirm Purchase ($${finalTotal.toFixed(2)})` }}
                </button>
                <p class="secure-note">
                    <svg class="secure-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Secure SSL encrypted transaction
                </p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useNotificationStore } from '../stores/notifications'
import { useImageStore, type ImageItem, type ImagePrice } from '../stores/images'
import CustomDropdown from '../components/CustomDropdown.vue'

const userStore = useUserStore()
const store = useImageStore() // Assuming typical name
const notificationStore = useNotificationStore()
const router = useRouter() // router was missing or I should just use it

const showCheckout = ref(false)
const isProcessing = ref(false)
const paymentMethod = ref(userStore.isLoggedIn ? 'card' : 'new-card') // Default based on auth
const couponCode = ref('')
const appliedCoupon = ref('')
const discountAmount = ref(0)
const couponError = ref('')

const finalTotal = computed(() => {
    return Math.max(0, userStore.cartTotal - discountAmount.value)
})

function applyCoupon() {
    couponError.value = ''
    if (!couponCode.value) return

    // Mock coupon logic
    if (couponCode.value.toUpperCase() === 'SAVE10') {
        appliedCoupon.value = 'SAVE10'
        discountAmount.value = userStore.cartTotal * 0.10 // 10% off
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

watch(() => userStore.cartTotal, () => {
    // Re-verify coupon if cart total changes (e.g. item removed)
    if (appliedCoupon.value) {
        applyCoupon()
    }
})

const form = reactive({
  email: userStore.account.email,
  cardName: userStore.account.name,
  // Address
  address: userStore.account.address,
  city: userStore.account.city,
  country: userStore.account.country,
  zip: userStore.account.zip,
  // Card
  cardNumber: '',
  expiry: '',
  cvc: ''
})

const suggestedImages = computed(() => {
    // Basic logic: images with shared tags from items in cart
    if (userStore.cart.length === 0) return store.recentImages;
    
    const cartTags = new Set(userStore.cart.flatMap(item => item.image.tags))
    return store.images
        .filter(img => !userStore.cart.some(item => item.image.id === img.id))
        .filter(img => img.tags.some(tag => cartTags.has(tag)))
        .slice(0, 4)
})

function updateItemPrice(index: number, newPrice: ImagePrice) {
    if (userStore.cart[index]) {
        userStore.cart[index].price = newPrice
    }
}

function startCheckout() {
    showCheckout.value = true
    // Reset payment method selection based on auth
    paymentMethod.value = userStore.isLoggedIn ? 'card' : 'new-card'
}

async function processPayment() {
    isProcessing.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    notificationStore.add('success', `Order placed successfully! Total Paid: $${finalTotal.value.toFixed(2)}`)
    userStore.cart = []
    showCheckout.value = false
    isProcessing.value = false
    // Reset coupon
    removeCoupon()
    router.push('/account')
}

function handleSugBuy(image: ImageItem) {
    router.push({ path: '/collections', query: { buy: image.id } })
}
</script>

<style scoped src="@/assets/css/cart-view.css"></style>
