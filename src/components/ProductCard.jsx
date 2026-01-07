import React from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/features/cartSlice'
import { BsFillBagFill } from 'react-icons/bs'
import { AiFillStar } from 'react-icons/ai'

const ProductCard = ({ product }) => {
    const dispatch = useDispatch()

    const handleAddToCart = () => {
        dispatch(addToCart(product))
    }

    const { image, title, name, rating, reviews, price, discountPercentage } = product

    // Use name or title depending on what the API returns (dummyjson uses title)
    const productName = title || name

    const discountedPrice = discountPercentage > 0
        ? (price - (price * discountPercentage / 100)).toFixed(2)
        : price

    return (
        <div className="card">
            <img src={image} alt={productName} className="card-img" />
            <div className="card-details">
                <h3 className="card-title">{productName}</h3>
                <div className="card-reviews">
                    <AiFillStar className="rating-star" />
                    <span className="total-reviews">{rating}</span>
                    <span className="total-reviews-count">(123 reviews)</span>
                </div>
                <div className="card-price">
                    <div className="price">
                        <del>${price}</del> ${discountedPrice}
                    </div>
                    <div className="bag" onClick={handleAddToCart}>
                        <BsFillBagFill className="bag-icon" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
