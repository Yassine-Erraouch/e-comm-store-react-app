import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, incrementQuantity, decrementQuantity } from '../store/features/cartSlice'

const Cart = () => {
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart.items)
    const total = useSelector(state => state.cart.total)
    const itemCount = useSelector(state => state.cart.itemCount)

    return (
        <div className="cart">
            <h2>🛒 Cart ({itemCount} items)</h2>
            <div className="cart-total">Total: ${total.toFixed(2)}</div>

            <div className="cart-items">
                {cartItems.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <span className="item-name">{item.name}</span>
                            <span className="item-price">${item.price} x {item.quantity}</span>
                            <div className="item-controls">
                                <button onClick={() => dispatch(decrementQuantity(item.id))}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
                                <button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Cart
