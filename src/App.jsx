import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchShoes } from './store/features/productsSlice'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Fetch shoes on component mount
  useEffect(() => {
    dispatch(fetchShoes())
  }, [dispatch])

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo or search could go here */}
          <div className="search-bar">
            <input type="text" placeholder="Enter your search shoes" />
          </div>

          <div className="nav-actions">
            <button onClick={() => setIsCartOpen(true)}>Cart 🛒</button>
          </div>
        </div>
      </nav>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <ProductList />
    </div>
  )
}

export default App
