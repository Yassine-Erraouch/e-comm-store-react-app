import { describe, it, expect } from 'vitest'
import productsReducer, { addProduct, deleteProduct, setSelectedCategory } from '../store/features/productsSlice'

describe('productsSlice', () => {
  const initialState = {
    products: [
      { id: 1, name: 'Shoe 1', price: 100, category: 'mens-shoes' },
      { id: 2, name: 'Shoe 2', price: 150, category: 'womens-shoes' }
    ],
    loading: false,
    error: null,
    selectedCategory: 'all'
  }

  it('should add a new product', () => {
    const newProduct = {
      name: 'New Shoe',
      price: 200,
      category: 'mens-shoes'
    }
    
    const action = addProduct(newProduct)
    const state = productsReducer(initialState, action)
    
    expect(state.products).toHaveLength(3)
    expect(state.products[2]).toMatchObject(newProduct)
    expect(state.products[2].id).toBeDefined()
  })

  it('should delete a product', () => {
    const action = deleteProduct(1)
    const state = productsReducer(initialState, action)
    
    expect(state.products).toHaveLength(1)
    expect(state.products[0].id).toBe(2)
  })

  it('should set selected category', () => {
    const action = setSelectedCategory('mens-shoes')
    const state = productsReducer(initialState, action)
    
    expect(state.selectedCategory).toBe('mens-shoes')
  })
})