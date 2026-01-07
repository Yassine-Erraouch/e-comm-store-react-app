import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  total: 0,
  itemCount: 0
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Create/Add item to cart
    addToCart: (state, action) => {
      const { id, name, price } = action.payload
      const existingItem = state.items.find(item => item.id === id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({
          id,
          name,
          price,
          quantity: 1
        })
      }
      
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    // Update item quantity
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id)
        } else {
          item.quantity = quantity
        }
      }
      
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    // Delete item from cart
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    // Clear entire cart
    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0
    },
    
    // Increase quantity by 1
    incrementQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload)
      if (item) {
        item.quantity += 1
      }
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    // Decrease quantity by 1
    decrementQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload)
      if (item) {
        if (item.quantity === 1) {
          state.items = state.items.filter(item => item.id !== action.payload)
        } else {
          item.quantity -= 1
        }
      }
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    // Helper to calculate totals
    calculateTotals: (state) => {
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    }
  }
})

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
  calculateTotals
} = cartSlice.actions

export default cartSlice.reducer