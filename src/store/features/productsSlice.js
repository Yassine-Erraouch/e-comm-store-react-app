import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk for fetching shoes
export const fetchShoes = createAsyncThunk(
  'products/fetchShoes',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch both men's and women's shoes
      const [mensResponse, womensResponse] = await Promise.all([
        fetch('https://dummyjson.com/products/category/mens-shoes'),
        fetch('https://dummyjson.com/products/category/womens-shoes')
      ])

      if (!mensResponse.ok || !womensResponse.ok) {
        throw new Error('Failed to fetch shoes')
      }

      const mensData = await mensResponse.json()
      const womensData = await womensResponse.json()

      // Combine and transform the data
      const allShoes = [...mensData.products, ...womensData.products]

      return allShoes.map(shoe => ({
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
      }))
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  products: [],
  loading: false,
  error: null,
  selectedCategory: 'all', // 'all', 'mens-shoes', 'womens-shoes'
  selectedBrand: 'all',
  selectedPriceRange: 'all',
  selectedColor: 'all'
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

    // Set color filter
    setSelectedColor: (state, action) => {
      state.selectedColor = action.payload
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
        state.error = action.payload
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
  setSelectedColor
} = productsSlice.actions

export default productsSlice.reducer