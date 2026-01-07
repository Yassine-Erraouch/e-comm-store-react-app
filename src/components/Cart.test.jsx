import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import Cart from './Cart'

const mockStore = configureStore([])

describe('Cart', () => {
    it('renders empty cart correctly', () => {
        const store = mockStore({
            cart: { items: [], total: 0 }
        })

        render(
            <Provider store={store}>
                <Cart isOpen={true} onClose={() => { }} />
            </Provider>
        )

        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
        expect(screen.getByText('Total:')).toBeInTheDocument()
        expect(screen.getByText('$0.00')).toBeInTheDocument()
        expect(screen.getByText('Checkout')).toBeDisabled()
    })

    it('renders cart items and interactions', () => {
        const store = mockStore({
            cart: {
                items: [
                    { id: 1, name: 'Nike Shoe', price: 100, quantity: 2, image: 'img.jpg' }
                ],
                total: 200
            }
        })
        store.dispatch = vi.fn()

        render(
            <Provider store={store}>
                <Cart isOpen={true} onClose={() => { }} />
            </Provider>
        )

        expect(screen.getByText('Nike Shoe')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument() // Quantity

        const incrementBtn = screen.getByText('+')
        fireEvent.click(incrementBtn)

        expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'cart/incrementQuantity',
            payload: 1
        }))
    })
})
