import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, incrementQuantity, decrementQuantity } from '../store/features/cartSlice'
import { MdClose } from 'react-icons/md'
import './Cart.css'

const Cart = ({ isOpen, onClose }) => {
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart.items)
    const total = useSelector(state => state.cart.total)
    const cartRef = useRef(null)

    // Close cart when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target) && isOpen) {
                onClose()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    return (
        <div className={`cart-overlay ${isOpen ? 'open' : ''}`}>
            <div className="cart-sidebar" ref={cartRef}>
                <div className="cart-header">
                    <h2>Your Cart</h2>
                    <button className="close-btn" onClick={onClose}>
                        <MdClose size={24} />
                    </button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <p className="empty-cart">Your cart is empty.</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-img" />
                                <div className="cart-item-details">
                                    <h4>{item.name}</h4>
                                    <p>${item.price}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => dispatch(decrementQuantity(item.id))}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
                                    </div>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => dispatch(removeFromCart(item.id))}
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div className="cart-total">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" disabled={cartItems.length === 0}>
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cart
