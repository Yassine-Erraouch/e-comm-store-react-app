import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ProductCard from './ProductCard'
import cartReducer from '../store/features/cartSlice'

const createMockStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer
    }
  })
}

const mockProduct = {
  id: 1,
  name: 'Test Shoe',
  price: 100,
  stock: 5,
  image: 'test-image.jpg',
  brand: 'Test Brand',
  rating: 4.5,
  discountPercentage: 0
}

describe('ProductCard', () => {
  it('should render product information', () => {
    const store = createMockStore()
    
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    )
    
    expect(screen.getByText('Test Shoe')).toBeInTheDocument()
    expect(screen.getByText('Test Brand')).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
    expect(screen.getByText('Stock: 5')).toBeInTheDocument()
    expect(screen.getByText('⭐ 4.5')).toBeInTheDocument()
  })

  it('should show "Add to Cart" button when in stock', () => {
    const store = createMockStore()
    
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    )
    
    const button = screen.getByText('Add to Cart')
    expect(button).toBeInTheDocument()
    expect(button).not.toBeDisabled()
  })

  it('should show "Out of Stock" when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    const store = createMockStore()
    
    render(
      <Provider store={store}>
        <ProductCard product={outOfStockProduct} />
      </Provider>
    )
    
    const button = screen.getByText('Out of Stock')
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  it('should dispatch addToCart when button is clicked', () => {
    const store = createMockStore()
    const spy = vi.spyOn(store, 'dispatch')
    
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    )
    
    fireEvent.click(screen.getByText('Add to Cart'))
    expect(spy).toHaveBeenCalled()
  })
})