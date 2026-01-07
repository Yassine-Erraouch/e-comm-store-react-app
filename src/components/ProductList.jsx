import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedCategory } from '../store/features/productsSlice'
import ProductCard from './ProductCard'

const ProductList = () => {
    const dispatch = useDispatch()
    const { products, selectedCategory } = useSelector(state => state.products)

    // Filter products based on selected category
    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'all') {
            return products
        }
        return products.filter(product => product.category === selectedCategory)
    }, [products, selectedCategory])

    const handleCategoryChange = (category) => {
        dispatch(setSelectedCategory(category))
    }

    return (
        <div className="product-list">
            <div className="category-filters">
                <button 
                    className={selectedCategory === 'all' ? 'active' : ''}
                    onClick={() => handleCategoryChange('all')}
                >
                    All Shoes ({products.length})
                </button>
                <button 
                    className={selectedCategory === 'mens-shoes' ? 'active' : ''}
                    onClick={() => handleCategoryChange('mens-shoes')}
                >
                    Men's Shoes ({products.filter(p => p.category === 'mens-shoes').length})
                </button>
                <button 
                    className={selectedCategory === 'womens-shoes' ? 'active' : ''}
                    onClick={() => handleCategoryChange('womens-shoes')}
                >
                    Women's Shoes ({products.filter(p => p.category === 'womens-shoes').length})
                </button>
            </div>

            <div className="products-grid">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default ProductList
