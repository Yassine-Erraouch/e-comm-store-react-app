import { describe, it, expect } from 'vitest'
import cartReducer, {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity
} from './cartSlice'

describe('cartSlice', () => {
  const initialState = {
    items: [],
    total: 0,
    itemCount: 0
  }

  const mockProduct = {
    id: 1,
    name: 'Test Shoe',
    price: 100
  }

  describe('addToCart', () => {
    it('should add a new item to empty cart', () => {
      const state = cartReducer(initialState, addToCart(mockProduct))
      
      expect(state.items).toHaveLength(1)
      expect(state.items[0].id).toBe(1)
      expect(state.items[0].quantity).toBe(1)
      expect(state.total).toBe(100)
      expect(state.itemCount).toBe(1)
    })

    it('should increment quantity if item already exists', () => {
      const stateWithItem = {
        items: [{ id: 1, name: 'Test Shoe', price: 100, quantity: 1 }],
        total: 100,
        itemCount: 1
      }
      const state = cartReducer(stateWithItem, addToCart(mockProduct))
      
      expect(state.items).toHaveLength(1)
      expect(state.items[0].quantity).toBe(2)
      expect(state.total).toBe(200)
      expect(state.itemCount).toBe(1)
    })
  })

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const stateWithItem = {
        items: [{ id: 1, name: 'Test Shoe', price: 100, quantity: 1 }],
        total: 100,
        itemCount: 1
      }
      const state = cartReducer(stateWithItem, updateQuantity({ id: 1, quantity: 5 }))
      
      expect(state.items[0].quantity).toBe(5)
      expect(state.total).toBe(500)
      expect(state.itemCount).toBe(1)
    })

    it('should remove item if quantity is 0 or less', () => {
      const stateWithItem = {
        items: [{ id: 1, name: 'Test Shoe', price: 100, quantity: 1 }],
        total: 100,
        itemCount: 1
      }
      const state = cartReducer(stateWithItem, updateQuantity({ id: 1, quantity: 0 }))
      
      expect(state.items).toHaveLength(0)
      expect(state.total).toBe(0)
      expect(state.itemCount).toBe(0)
    })
  })

  describe('removeFromCart', () => {
    it('should remove item from cart', () => {
      const stateWithItem = {
        items: [{ id: 1, name: 'Test Shoe', price: 100, quantity: 2 }],
        total: 200,
        itemCount: 2
      }
      const state = cartReducer(stateWithItem, removeFromCart(1))
      
      expect(state.items).toHaveLength(0)
      expect(state.total).toBe(0)
      expect(state.itemCount).toBe(0)
    })
  })

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const stateWithItems = {
        items: [
          { id: 1, name: 'Shoe 1', price: 100, quantity: 2 },
          { id: 2, name: 'Shoe 2', price: 50, quantity: 1 }
        ],
        total: 250,
        itemCount: 3
      }
      const state = cartReducer(stateWithItems, clearCart())
      
      expect(state.items).toEqual(initialState)
      expect(state.total).toBe(0)
      expect(state.itemCount).toBe(0)
    })
  })

  describe('incrementQuantity', () => {
    it('should increase item quantity by 1', () => {
      const stateWithItem = {
        items: [{ id: 1, name: 'Test Shoe', price: 100, quantity: 1 }],
        total: 100,
        itemCount: 1
      }
      const state = cartReducer(stateWithItem, incrementQuantity(1))
      
      expect(state.items[0].quantity).toBe(2)
      expect(state.total).toBe(200)
      expect(state.itemCount).toBe(1)
    })
  })

  describe('decrementQuantity', () => {
    it('should decrease item quantity by 1', () => {
      const stateWithItem = {
        items: [{ id: 1, name: 'Test Shoe', price: 100, quantity: 3 }],
        total: 300,
        itemCount: 1
      }
      const state = cartReducer(stateWithItem, decrementQuantity(1))
      
      expect(state.items[0].quantity).toBe(2)
      expect(state.total).toBe(200)
      expect(state.itemCount).toBe(1)
    })

    it('should remove item if quantity becomes 0', () => {
      const stateWithItem = {
        items: [{ id: 1, name: 'Test Shoe', price: 100, quantity: 1 }],
        total: 100,
        itemCount: 1
      }
      const state = cartReducer(stateWithItem, decrementQuantity(1))
      
      expect(state.items).toHaveLength(0)
      expect(state.total).toBe(0)
      expect(state.itemCount).toBe(0)
    })
  })
})
