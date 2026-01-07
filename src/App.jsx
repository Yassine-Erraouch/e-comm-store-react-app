import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart, removeFromCart, incrementQuantity, decrementQuantity } from './store/features/cartSlice'
import { fetchShoes, addProduct, deleteProduct, setSelectedCategory } from './store/features/productsSlice'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const { products, loading, error, selectedCategory } = useSelector(state => state.products)
  const cartItems = useSelector(state => state.cart.items)
  const cartTotal = useSelector(state => state.cart.total)
  const itemCount = useSelector(state => state.cart.itemCount)

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products
    }
    return products.filter(product => product.category === selectedCategory)
  }, [products, selectedCategory])

  // Fetch shoes on component mount
  useEffect(() => {
    dispatch(fetchShoes())
  }, [dispatch])

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
  }

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId))
  }

  const handleAddProduct = () => {
    const newShoe = {
      name: 'Custom Shoe',
      price: Math.floor(Math.random() * 200) + 50,
      category: 'custom-shoes',
      stock: 5,
      brand: 'Custom Brand',
      description: 'A custom shoe added to the collection'
    }
    dispatch(addProduct(newShoe))
  }

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category))
  }

  const getDiscountedPrice = (price, discount) => {
    return (price - (price * discount / 100)).toFixed(2)
  }

  if (loading) {
    return <div className="loading">Loading shoes...</div>
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error loading shoes: {error}</h2>
        <button onClick={() => dispatch(fetchShoes())}>Retry</button>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>👟 Shoe Store</h1>
      
      <div className="cart-summary">
        <h2>🛒 Cart ({itemCount} items) - Total: ${cartTotal.toFixed(2)}</h2>
      </div>

      <div className="products-section">
        <div className="section-header">
          <h2>Shoes Collection ({filteredProducts.length})</h2>
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
        </div>
        
        <div className="actions">
          <button onClick={handleAddProduct}>Add Custom Shoe</button>
          <button onClick={() => dispatch(fetchShoes())}>Refresh All Shoes</button>
        </div>
        
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              {product.image && (
                <img src={product.image} alt={product.name} className="product-image" />
              )}
              <div className="product-info">
                <h3>{product.name}</h3>
                {product.brand && <p className="brand">Brand: {product.brand}</p>}
                
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
                
                <p className="category">Category: {product.category.replace('-', ' ')}</p>
                <p className="stock">Stock: {product.stock}</p>
                
                {product.rating && (
                  <div className="rating">
                    ⭐ {product.rating.toFixed(1)} / 5
                  </div>
                )}
                
                {product.description && (
                  <p className="description">{product.description.substring(0, 100)}...</p>
                )}
              </div>
              
              <div className="product-actions">
                <button 
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="add-to-cart"
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button 
                  onClick={() => dispatch(deleteProduct(product.id))}
                  className="delete-product"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cart-section">
        <h2>Cart Items</h2>
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <span>{item.name} - ${item.price} x {item.quantity}</span>
            <div>
              <button onClick={() => dispatch(decrementQuantity(item.id))}>-</button>
              <button onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
              <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
