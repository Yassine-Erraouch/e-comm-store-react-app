import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// API URLs for fetching shoes
const MENS_SHOES_URL = 'https://dummyjson.com/products/category/mens-shoes'
const WOMENS_SHOES_URL = 'https://dummyjson.com/products/category/womens-shoes'

// Helper function to transform API data into our app's format
const transformShoeData = (shoe) => ({
  id: shoe.id,
  name: shoe.title,
  price: shoe.price,
  category: shoe.category,
  stock: shoe.stock,
  image: shoe.thumbnail,
  images: shoe.images,
  description: shoe.description,
  brand: shoe.brand,
  rating: shoe.rating,
  discountPercentage: shoe.discountPercentage
})

// Async thunk for fetching shoes from the API
export const fetchShoes = createAsyncThunk(
  'products/fetchShoes',
  async () => {
    // Step 1: Fetch men's shoes
    const mensResponse = await fetch(MENS_SHOES_URL)
    if (!mensResponse.ok) {
      throw new Error('Failed to fetch mens shoes')
    }
    const mensData = await mensResponse.json()

    // Step 2: Fetch women's shoes
    const womensResponse = await fetch(WOMENS_SHOES_URL)
    if (!womensResponse.ok) {
      throw new Error('Failed to fetch womens shoes')
    }
    const womensData = await womensResponse.json()

    // Step 3: Combine both lists and transform the data
    const allShoes = [...mensData.products, ...womensData.products]
    return allShoes.map(transformShoeData)
  }
)

const initialState = {
  products: [],
  loading: false,
  error: null,
  selectedCategory: 'all', // 'all', 'mens-shoes', 'womens-shoes'
  selectedBrand: 'all',
  selectedPriceRange: 'all',
  selectedRating: 'all' // 'all', '4', '3', '2'
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Create
    addProduct: (state, action) => {
      const newProduct = {
        id: Date.now(),
        ...action.payload
      }
      state.products.push(newProduct)
    },

    // Update
    updateProduct: (state, action) => {
      const { id, updates } = action.payload
      const productIndex = state.products.findIndex(product => product.id === id)
      if (productIndex !== -1) {
        state.products[productIndex] = { ...state.products[productIndex], ...updates }
      }
    },

    // Delete
    deleteProduct: (state, action) => {
      state.products = state.products.filter(product => product.id !== action.payload)
    },

    // Update stock (for cart operations)
    updateStock: (state, action) => {
      const { id, quantity } = action.payload
      const product = state.products.find(product => product.id === id)
      if (product) {
        product.stock -= quantity
      }
    },

    // Set category filter
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    },

    // Set brand filter
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload
    },

    // Set price range filter
    setSelectedPriceRange: (state, action) => {
      state.selectedPriceRange = action.payload
    },

    // Set rating filter
    setSelectedRating: (state, action) => {
      state.selectedRating = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShoes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchShoes.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
        state.error = null
      })
      .addCase(fetchShoes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const {
  addProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  setSelectedCategory,
  setSelectedBrand,
  setSelectedPriceRange,
  setSelectedRating
} = productsSlice.actions

export default productsSlice.reducer