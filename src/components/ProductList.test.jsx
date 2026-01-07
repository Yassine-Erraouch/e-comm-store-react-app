import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import ProductList from './ProductList'

const mockStore = configureStore([])

describe('ProductList', () => {
    const initialState = {
        products: {
            products: [
                { id: 1, title: 'Nike Shoe', category: 'sneakers', price: 100, image: 'img1.jpg', brand: 'Nike' },
                { id: 2, title: 'Adidas Shoe', category: 'sneakers', price: 80, image: 'img2.jpg', brand: 'Adidas' }
            ],
            selectedCategory: 'all',
            selectedBrand: 'all',
            selectedPriceRange: 'all',
            selectedColor: 'all'
        }
    }

    it('renders sidebar filters and product list', () => {
        const store = mockStore(initialState)
        render(
            <Provider store={store}>
                <ProductList />
            </Provider>
        )

        // Check Sidebar sections
        expect(screen.getByText('Category')).toBeInTheDocument()
        expect(screen.getByText('Price')).toBeInTheDocument()
        expect(screen.getByText('Colors')).toBeInTheDocument()

        // Check Product Cards
        expect(screen.getByText('Nike Shoe')).toBeInTheDocument()
        expect(screen.getByText('Adidas Shoe')).toBeInTheDocument()
    })

    it('filters are interactive', () => {
        const store = mockStore(initialState)
        // We can't easily test state updates with mockStore as it doesn't update, 
        // but we can check if dispatch is called.
        store.dispatch = vi.fn()

        render(
            <Provider store={store}>
                <ProductList />
            </Provider>
        )

        const sneakersFilter = screen.getByLabelText('Sneakers')
        fireEvent.click(sneakersFilter)

        expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'products/setSelectedCategory',
            payload: 'sneakers'
        }))
    })
})
