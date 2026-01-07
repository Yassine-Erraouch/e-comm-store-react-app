import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchShoes } from './store/features/productsSlice'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const { loading, error } = useSelector(state => state.products)

  useEffect(() => {
    dispatch(fetchShoes())
  }, [dispatch])

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
      <Cart />
      <ProductList />
    </div>
  )
}

export default App