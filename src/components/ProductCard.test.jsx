import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import ProductCard from './ProductCard'

const mockStore = configureStore([])

describe('ProductCard', () => {
    const product = {
        id: 1,
        image: 'test-image.jpg',
        title: 'Test Shoe',
        price: 100,
        rating: 4.5,
        discountPercentage: 20
    }

    it('renders product details correctly', () => {
        const store = mockStore({})
        render(
            <Provider store={store}>
                <ProductCard product={product} />
            </Provider>
        )

        expect(screen.getByText('Test Shoe')).toBeInTheDocument()
        expect(screen.getByText('4.5')).toBeInTheDocument()
        // Discounted price calculation: 100 - 20% = 80
        expect(screen.getByText('$80.00')).toBeInTheDocument()
    })

    it('dispatches addToCart action on button click', () => {
        const store = mockStore({})
        store.dispatch = vi.fn()

        render(
            <Provider store={store}>
                <ProductCard product={product} />
            </Provider>
        )

        const bagIcon = screen.getByRole('img', { hidden: true }) // react-icons might be hidden or generic SVG
        // Alternatively, find the container div
        const bagButton = screen.getByText((content, element) => {
            return element.classList.contains('bag')
        })

        fireEvent.click(bagButton)

        expect(store.dispatch).toHaveBeenCalled()
        expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'cart/addToCart',
            payload: product
        }))
    })
})
