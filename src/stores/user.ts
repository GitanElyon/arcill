import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ImageItem, ImagePrice } from './images'

export interface CartItem {
  image: ImageItem
  price: ImagePrice
}

export interface SavedCard {
    id: string
    last4: string
    brand: string // 'visa', 'mastercard', etc.
}

export interface UserAccount {
  name: string
  email: string
  address: string
  city: string
  country: string
  zip: string
  cardNumber: string // Keeping for legacy/display of "default" card
  savedCards: SavedCard[]
  isSubscribed: boolean
  purchaseHistory: { date: Date, title: string, price: number }[]
}

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const bookmarks = ref<string[]>([]) // Array of image IDs
  const cart = ref<CartItem[]>([])
  
  const account = ref<UserAccount>({
    name: 'Balage Balogh',
    email: 'balage@archaeologyillustrated.com',
    address: '123 History Lane',
    city: 'Budapest',
    country: 'Hungary',
    zip: '1000',
    cardNumber: '**** **** **** 1234',
    savedCards: [
        { id: '1', last4: '1234', brand: 'visa' }
    ],
    isSubscribed: true,
    purchaseHistory: [
      { date: new Date('2023-11-20'), title: 'Roman Forum Reconstruction', price: 90 },
      { date: new Date('2023-05-15'), title: 'Roman Longship', price: 60 }
    ]
  })

  // Bookmarks logic
  function toggleBookmark(imageId: string) {
    if (!isLoggedIn.value) return
    const index = bookmarks.value.indexOf(imageId)
    if (index === -1) {
      bookmarks.value.push(imageId)
    } else {
      bookmarks.value.splice(index, 1)
    }
  }

  function isBookmarked(imageId: string) {
    return bookmarks.value.includes(imageId)
  }

  // Cart logic
  function addToCart(image: ImageItem, price: ImagePrice) {
    cart.value.push({ image, price })
  }

  function removeFromCart(index: number) {
    cart.value.splice(index, 1)
  }

  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + item.price.price, 0)
  })

  function login() {
    isLoggedIn.value = true
  }

  function logout() {
    isLoggedIn.value = false
  }

  function updateCard(newCardNumber: string) {
    // Basic masking simulation
    const lastFour = newCardNumber.slice(-4)
    account.value.cardNumber = `**** **** **** ${lastFour}`
    // Also push to saved cards if not exists
    if (!account.value.savedCards.some(c => c.last4 === lastFour)) {
        account.value.savedCards.push({
            id: Date.now().toString(),
            last4: lastFour,
            brand: 'visa' // Mock
        })
    }
  }

  function deleteAccount() {
    isLoggedIn.value = false
    bookmarks.value = []
    cart.value = []
    // Reset to initial state or just clear sensitive data
    account.value = {
        name: 'Guest', 
        email: '', 
        address: '', 
        city: '',
        country: '',
        zip: '',
        cardNumber: '', 
        savedCards: [],
        isSubscribed: false, 
        purchaseHistory: []
    }
  }

  return {
    isLoggedIn,
    bookmarks,
    cart,
    account,
    toggleBookmark,
    isBookmarked,
    addToCart,
    removeFromCart,
    cartTotal,
    login,
    logout,
    deleteAccount,
    updateCard
  }
})
