import React from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/features/cartSlice'

const ProductCard = ({ product }) => {
    const dispatch = useDispatch()

    const handleAddToCart = () => {
        dispatch(addToCart(product))
    }

    const getDiscountedPrice = (price, discount) => {
        return (price - (price * discount / 100)).toFixed(2)
    }

    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
                <h3>{product.name}</h3>
                {product.brand && <p className="brand">{product.brand}</p>}
                
                <div className="price-section">
                    {product.discountPercentage > 0 ? (
                        <>
                            <span className="original-price">${product.price}</span>
                            <span className="discounted-price">
                                ${getDiscountedPrice(product.price, product.discountPercentage)}
                            </span>
                            <span className="discount-badge">-{product.discountPercentage.toFixed(0)}%</span>
                        </>
                    ) : (
                        <span className="price">${product.price}</span>
                    )}
                </div>
                
                {product.rating && (
                    <div className="rating">⭐ {product.rating.toFixed(1)}</div>
                )}
                
                <p className="stock">Stock: {product.stock}</p>
            </div>
            
            <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="add-to-cart"
            >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    )
}

export default ProductCard
