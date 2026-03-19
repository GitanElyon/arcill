import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// CONSTANTS

const STANDARD_RESOLUTIONS = [
  { resolution: '1200x800', price: 30, label: 'Small Web' },
  { resolution: '2000x1200', price: 60, label: 'Large Web' },
  { resolution: '3000x1800', price: 90, label: 'Print A4' },
  { resolution: '4000x3200', price: 150, label: 'Print A3' },
  { resolution: '6000x3800', price: 250, label: 'Ultra High Res' }
]

const TIME_PERIODS = [
    'Prehistory',
    'Uruk Period',
    'Early Bronze Age',
    'Middle Bronze Age',
    'Late Bronze Age',
    'Minoan Period',
    'Mycenaean Period',
    'Iron Age I',
    'Iron Age II',
    'Assyrian Period',
    'Babylonian Period',
    'Persian Period',
    'Classical Greece',
    'Hellenistic Period',
    'Roman Period',
    'Herodian Architecture',
    'Byzantine Period',
    'Sasanian Period',
    'Arab Period'
]

const COUNTRIES = [
    'Afghanistan',
    'Athens',
    'Egypt',
    'France',
    'Greece',
    'India',
    'Iran',
    'Iraq',
    'Israel',
    'Jerusalem',
    'Italy',
    'Jordan',
    'Lebanon',
    'Libya',
    'Pakistan',
    'Rome',
    'Syria',
    'Tunisia',
    'Turkey'
]

// TYPES

export interface ImagePrice {
  resolution: string
  price: number
  label: string
}

export interface ImageItem {
  id: string
  title: string
  description: string
  timePeriod: string
  year: number // Negative for BC, Positive for AD
  country: string
  tags: string[]
  artist: string
  prices: ImagePrice[]
  imageUrl: string
  dateAdded: Date
  views: number
}

export const useImageStore = defineStore('images', () => {

  const getStandardPrices = (): ImagePrice[] => [...STANDARD_RESOLUTIONS]

  const images = ref<ImageItem[]>([])
  const isLoading = ref(false)

  async function loadImages() {
    if (isLoading.value) return
    isLoading.value = true

    try {
      const response = await $fetch<Array<Omit<ImageItem, 'dateAdded' | 'prices'> & { dateAdded: string, prices?: ImagePrice[] }>>('/api/images')
      images.value = response.map((image) => ({
        ...image,
        prices: image.prices?.length ? image.prices : getStandardPrices(),
        dateAdded: new Date(image.dateAdded)
      }))
    } finally {
      isLoading.value = false
    }
  }

  if (import.meta.client) {
    loadImages().catch(() => {
      images.value = [
        {
          id: '1',
          title: 'Roman Forum Reconstruction',
          description: 'A detailed reconstruction of the Roman Forum during the Imperial period.',
          timePeriod: 'Roman Period',
          year: 200,
          country: 'Rome',
          tags: ['Roman', 'Architecture', 'City', 'Imperial'],
          artist: 'ArcIll',
          imageUrl: 'https://placehold.co/600x400?text=Roman+Forum',
          prices: getStandardPrices(),
          dateAdded: new Date('2023-01-15'),
          views: 1250
        }
      ]
    })
  }

  // Filters state
  const searchQuery = ref('')
  const selectedTimePeriod = ref('')
  const selectedCountry = ref('')
  const selectedTags = ref<string[]>([])
  const yearRange = ref<{min: number | null, max: number | null}>({ min: null, max: null })

  // Initialize year range with data bounds when available, or some defaults
  // We'll use a wrapper computed or action to set these properly if needed,
  // but for now the store holds the filtered range.
  
  // Data Getters
  const uniqueTimePeriods = computed(() => TIME_PERIODS)
  const uniqueCountries = computed(() => COUNTRIES)
  
  const minYear = computed(() => {
    if (images.value.length === 0) return -2000
    return Math.min(...images.value.map(img => img.year))
  })

  const maxYear = computed(() => {
    if (images.value.length === 0) return 2024
    return Math.max(...images.value.map(img => img.year))
  })

  const uniqueTags = computed(() => {
    const tags = new Set<string>()
    images.value.forEach(img => img.tags.forEach(tag => tags.add(tag)))
    return Array.from(tags).sort()
  })

  // Computed filtered images
  const filteredImages = computed(() => {
    return images.value.filter(img => {
      // Search Query
      const matchesSearch = searchQuery.value === '' || 
        img.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
        img.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        img.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))

      // Time Period
      const matchesTimePeriod = selectedTimePeriod.value === '' || img.timePeriod === selectedTimePeriod.value

      // Country
      const matchesCountry = selectedCountry.value === '' || img.country === selectedCountry.value

      // Year Range
      let matchesYear = true
      if (yearRange.value.min !== null) matchesYear = matchesYear && img.year >= yearRange.value.min
      if (yearRange.value.max !== null) matchesYear = matchesYear && img.year <= yearRange.value.max

      // Tags (AND logic: image must have ALL selected tags)
      const matchesTags = selectedTags.value.length === 0 || 
        selectedTags.value.every(tag => img.tags.includes(tag))

      return matchesSearch && matchesTimePeriod && matchesCountry && matchesTags && matchesYear
    })
  })

  // Home Page Getters
  const recentImages = computed(() => {
    return [...images.value].sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime()).slice(0, 4)
  })

  const popularImages = computed(() => {
    return [...images.value].sort((a, b) => b.views - a.views).slice(0, 4)
  })
  
  const popularTags = computed(() => {
      // Rough logic: tags that appear most frequent
      const tagCounts: Record<string, number> = {}
      images.value.forEach(img => {
          img.tags.forEach(tag => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1
          })
      })
      return Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(entry => entry[0])
  })

  function resetFilters() {
    searchQuery.value = ''
    selectedTimePeriod.value = ''
    selectedCountry.value = ''
    selectedTags.value = []
    yearRange.value = { min: null, max: null }
  }

  return { 
    images, 
    searchQuery, 
    selectedTimePeriod, 
    selectedCountry,
    selectedTags, 
    yearRange,
    minYear,
    maxYear,
    uniqueTimePeriods, 
    uniqueCountries,
    uniqueTags, 
    filteredImages,
    recentImages,
    popularImages,
    popularTags,
    loadImages,
    isLoading,
    resetFilters
  }
})
