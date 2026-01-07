import { describe, it, expect } from 'vitest'
import cartReducer, { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } from '../store/features/cartSlice'

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

  it('should add item to cart', () => {
    const action = addToCart(mockProduct)
    const state = cartReducer(initialState, action)
    
    expect(state.items).toHaveLength(1)
    expect(state.items[0]).toEqual({
      id: 1,
      name: 'Test Shoe',
      price: 100,
      quantity: 1
    })
    expect(state.total).toBe(100)
    expect(state.itemCount).toBe(1)
  })

  it('should increment quantity when adding same item', () => {
    const stateWithItem = {
      items: [{ id: 1, name: 'Test Shoe', price: 100, quantity: 1 }],
      total: 100,
      itemCount: 1
    }
    
    const action = addToCart(mockProduct)
    const state = cartReducer(stateWithItem, action)
    
    expect(state.items[0].quantity).toBe(2)
    expect(state.total).toBe(200)
    expect(state.itemCount).toBe(1)
  })

  it('should remove item from cart', () => {
    const stateWithItem = {
      items: [{ id: 1, name: 'Test Shoe', price: 100, quantity: 1 }],
      total: 100,
      itemCount: 1
    }
    
    const action = removeFromCart(1)
    const state = cartReducer(stateWithItem, action)
    
    expect(state.items).toHaveLength(0)
    expect(state.total).toBe(0)
    expect(state.itemCount).toBe(0)
  })

  it('should clear cart', () => {
    const stateWithItems = {
      items: [
        { id: 1, name: 'Test Shoe', price: 100, quantity: 2 },
        { id: 2, name: 'Another Shoe', price: 50, quantity: 1 }
      ],
      total: 250,
      itemCount: 3
    }
    
    const action = clearCart()
    const state = cartReducer(stateWithItems, action)
    
    expect(state.items).toHaveLength(0)
    expect(state.total).toBe(0)
    expect(state.itemCount).toBe(0)
  })
})