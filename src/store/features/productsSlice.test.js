import { describe, it, expect } from 'vitest'
import productsReducer, {
  addProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  setSelectedCategory,
  setSelectedBrand,
  setSelectedPriceRange,
  fetchShoes
} from './productsSlice'

describe('productsSlice', () => {
  // Starting state for our tests
  const initialState = {
    products: [],
    loading: false,
    error: null,
    selectedCategory: 'all',
    selectedBrand: 'all',
    selectedPriceRange: 'all'
  }

  // Sample product for testing
  const mockProduct = {
    id: 1,
    name: 'Test Shoe',
    price: 99.99,
    category: 'mens-shoes',
    stock: 10,
    brand: 'Nike'
  }

  // ============================================
  // CRUD Operations Tests
  // ============================================

  describe('addProduct', () => {
    it('should add a new product to the list', () => {
      const newProduct = { name: 'New Shoe', price: 50 }
      const state = productsReducer(initialState, addProduct(newProduct))

      expect(state.products).toHaveLength(1)
      expect(state.products[0].name).toBe('New Shoe')
      expect(state.products[0].price).toBe(50)
    })
  })

  describe('updateProduct', () => {
    it('should update an existing product', () => {
      // Start with one product in the list
      const stateWithProduct = { ...initialState, products: [mockProduct] }

      // Update the price
      const state = productsReducer(
        stateWithProduct,
        updateProduct({ id: 1, updates: { price: 79.99 } })
      )

      expect(state.products[0].price).toBe(79.99)
      expect(state.products[0].name).toBe('Test Shoe') // Other fields unchanged
    })

    it('should not change anything if product is not found', () => {
      const stateWithProduct = { ...initialState, products: [mockProduct] }

      const state = productsReducer(
        stateWithProduct,
        updateProduct({ id: 999, updates: { price: 79.99 } })
      )

      expect(state.products[0].price).toBe(99.99) // Price unchanged
    })
  })

  describe('deleteProduct', () => {
    it('should remove a product from the list', () => {
      const stateWithProduct = { ...initialState, products: [mockProduct] }

      const state = productsReducer(stateWithProduct, deleteProduct(1))

      expect(state.products).toHaveLength(0)
    })
  })

  describe('updateStock', () => {
    it('should decrease stock when items are purchased', () => {
      const stateWithProduct = { ...initialState, products: [mockProduct] }

      const state = productsReducer(
        stateWithProduct,
        updateStock({ id: 1, quantity: 3 })
      )

      expect(state.products[0].stock).toBe(7) // 10 - 3 = 7
    })
  })

  // ============================================
  // Filter Actions Tests
  // ============================================

  describe('filter actions', () => {
    it('should set selected category', () => {
      const state = productsReducer(initialState, setSelectedCategory('mens-shoes'))
      expect(state.selectedCategory).toBe('mens-shoes')
    })

    it('should set selected brand', () => {
      const state = productsReducer(initialState, setSelectedBrand('Nike'))
      expect(state.selectedBrand).toBe('Nike')
    })

    it('should set selected price range', () => {
      const state = productsReducer(initialState, setSelectedPriceRange('50to100'))
      expect(state.selectedPriceRange).toBe('50to100')
    })
  })

  // ============================================
  // Async Thunk Tests (fetchShoes)
  // ============================================

  describe('fetchShoes async thunk', () => {
    it('should set loading to true when fetch starts', () => {
      const state = productsReducer(initialState, { type: fetchShoes.pending.type })

      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should store products when fetch succeeds', () => {
      const fetchedProducts = [mockProduct]

      const state = productsReducer(initialState, {
        type: fetchShoes.fulfilled.type,
        payload: fetchedProducts
      })

      expect(state.loading).toBe(false)
      expect(state.products).toEqual(fetchedProducts)
      expect(state.error).toBeNull()
    })

    it('should store error message when fetch fails', () => {
      const state = productsReducer(initialState, {
        type: fetchShoes.rejected.type,
        error: { message: 'Failed to fetch' }
      })

      expect(state.loading).toBe(false)
      expect(state.error).toBe('Failed to fetch')
    })
  })
})
