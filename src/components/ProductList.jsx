import { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedCategory, setSelectedBrand, setSelectedPriceRange } from '../store/features/productsSlice'
import ProductCard from './ProductCard'

const ProductList = () => {
    const dispatch = useDispatch()
    const { products, selectedCategory, selectedBrand, selectedPriceRange } = useSelector(state => state.products)

    // Get unique brands from products
    const brands = useMemo(() => {
        const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))]
        return uniqueBrands.sort()
    }, [products])

    // Filter products based on all filters
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory
            const brandMatch = selectedBrand === 'all' || product.brand === selectedBrand
            let priceMatch = true
            if (selectedPriceRange === 'under50') priceMatch = product.price < 50
            else if (selectedPriceRange === '50to100') priceMatch = product.price >= 50 && product.price <= 100
            else if (selectedPriceRange === 'over100') priceMatch = product.price > 100
            return categoryMatch && brandMatch && priceMatch
        })
    }, [products, selectedCategory, selectedBrand, selectedPriceRange])

    return (
        <div className="product-list-container" style={{ display: 'flex', gap: '20px' }}>
            {/* Sidebar */}
            <div className="filters-sidebar" style={{ width: '200px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0 }}>Filters</h3>
                
                {/* Category Filter */}
                <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: '8px' }}>Category</h4>
                    <select 
                        value={selectedCategory} 
                        onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="all">All Shoes ({products.length})</option>
                        <option value="mens-shoes">Men's Shoes</option>
                        <option value="womens-shoes">Women's Shoes</option>
                    </select>
                </div>

                {/* Brand Filter */}
                <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: '8px' }}>Brand</h4>
                    <select 
                        value={selectedBrand} 
                        onChange={(e) => dispatch(setSelectedBrand(e.target.value))}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="all">All Brands</option>
                        {brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>

                {/* Price Range Filter */}
                <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: '8px' }}>Price Range</h4>
                    <select 
                        value={selectedPriceRange} 
                        onChange={(e) => dispatch(setSelectedPriceRange(e.target.value))}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="all">All Prices</option>
                        <option value="under50">Under $50</option>
                        <option value="50to100">$50 - $100</option>
                        <option value="over100">Over $100</option>
                    </select>
                </div>

                <p style={{ fontSize: '14px', color: '#666' }}>
                    Showing {filteredProducts.length} of {products.length} products
                </p>
            </div>

            {/* Products Grid */}
            <div className="product-list" style={{ flex: 1 }}>
                <div className="products-grid">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {filteredProducts.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#666' }}>No products match your filters.</p>
                )}
            </div>
        </div>
    )
}

export default ProductList
