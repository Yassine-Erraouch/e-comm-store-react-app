import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from './ProductCard'
import {
    setSelectedCategory,
    setSelectedPriceRange,
    setSelectedColor
} from '../store/features/productsSlice'
import './ProductList.css'

const ProductList = () => {
    const dispatch = useDispatch()
    const products = useSelector(state => state.products.products)
    const { selectedCategory, selectedBrand, selectedPriceRange, selectedColor } = useSelector(state => state.products)

    // -- Sidebar Filter Handler Components --
    const Category = () => {
        const categories = [
            { id: 'all', name: 'All' },
            { id: 'sneakers', name: 'Sneakers' }, // Mapping logic might be needed
            { id: 'flats', name: 'Flats' },
            { id: 'sandals', name: 'Sandals' },
            { id: 'heels', name: 'Heels' }
        ]

        return (
            <div className="ml-filter-section">
                <h2 className="sidebar-title">Category</h2>
                <div>
                    {categories.map((cat) => (
                        <label key={cat.id} className="sidebar-label-container">
                            <input
                                type="radio"
                                name="category"
                                value={cat.id}
                                checked={selectedCategory === cat.id}
                                onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
                            />
                            <span className="checkmark"></span>{cat.name}
                        </label>
                    ))}
                </div>
            </div>
        )
    }

    const Price = () => {
        const prices = [
            { id: 'all', name: 'All' },
            { id: '0-50', name: '$0 - $50' },
            { id: '50-100', name: '$50 - $100' },
            { id: '100-150', name: '$100 - $150' },
            { id: 'over-150', name: 'Over $150' },
        ]

        return (
            <div className="ml-filter-section">
                <h2 className="sidebar-title price-title">Price</h2>
                {prices.map((p) => (
                    <label key={p.id} className="sidebar-label-container">
                        <input
                            type="radio"
                            name="price"
                            value={p.id}
                            checked={selectedPriceRange === p.id}
                            onChange={(e) => dispatch(setSelectedPriceRange(e.target.value))}
                        />
                        <span className="checkmark"></span>{p.name}
                    </label>
                ))}
            </div>
        )
    }

    const Colors = () => {
        const colors = [
            { id: 'all', name: 'All', color: '' },
            { id: 'black', name: 'Black', color: 'black' },
            { id: 'blue', name: 'Blue', color: 'blue' },
            { id: 'red', name: 'Red', color: 'red' },
            { id: 'green', name: 'Green', color: 'green' },
            { id: 'white', name: 'White', color: 'white' },
        ]

        return (
            <div className="ml-filter-section">
                <h2 className="sidebar-title color-title">Colors</h2>
                {colors.map((c) => (
                    <label key={c.id} className="sidebar-label-container">
                        <input
                            type="radio"
                            name="color"
                            value={c.id}
                            checked={selectedColor === c.id}
                            onChange={(e) => dispatch(setSelectedColor(e.target.value))}
                        />
                        <span className={`checkmark ${c.id === 'all' ? 'all-color' : ''}`} style={{ backgroundColor: c.color }}></span>{c.name}
                    </label>
                ))}
            </div>
        )
    }

    // -- Filtering Logic --
    const filteredProducts = products.filter(product => {
        // Brand Filter
        if (selectedBrand !== 'all' && product.brand !== selectedBrand) return false

        // Category Filter (Loose matching for demo purposes as data might not align perfectly)
        if (selectedCategory !== 'all') {
            // If our dummy data categories don't explicitly match 'sneakers', 'heels' etc, 
            // we might need to rely on title/description search or just strict category matching depending on data.
            // For now, assuming "mens-shoes" and "womens-shoes" are the main ones from API, but UI has specific types.
            // Let's try to match if the product category OR title contains the selected category string.
            const searchStr = (product.category + product.title).toLowerCase()
            // "sneakers" is a common term, for others it might be harder.
            // Simple logic: if selectedCategory is NOT 'mens-shoes' or 'womens-shoes' (API categories), do text search
            if (selectedCategory !== 'mens-shoes' && selectedCategory !== 'womens-shoes') {
                if (!searchStr.includes(selectedCategory)) return false
            } else {
                if (product.category !== selectedCategory) return false
            }
        }

        // Price Filter
        if (selectedPriceRange !== 'all') {
            const price = product.price
            if (selectedPriceRange === '0-50' && (price < 0 || price > 50)) return false
            if (selectedPriceRange === '50-100' && (price < 50 || price > 100)) return false
            if (selectedPriceRange === '100-150' && (price < 100 || price > 150)) return false
            if (selectedPriceRange === 'over-150' && price <= 150) return false
        }

        // Color Filter (Text search in description/title as dummyJson doesn't have color field always)
        if (selectedColor !== 'all') {
            const searchStr = (product.title + product.description).toLowerCase()
            if (!searchStr.includes(selectedColor)) return false
        }

        return true
    })

    return (
        <div className="product-list-container">
            <section className="sidebar">
                <div className="logo-container">
                    <h1>🛒</h1>
                </div>
                <Category />
                <Price />
                <Colors />
            </section>

            <section className="card-container">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </section>
        </div>
    )
}

export default ProductList
