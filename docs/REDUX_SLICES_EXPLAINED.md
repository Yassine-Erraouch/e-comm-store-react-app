# Redux Slices Explained for Beginners

This guide explains how Redux slices work in our shoe store app. We'll go through each file line by line so you can understand exactly what's happening.

## Table of Contents

1. [What is a Redux Slice?](#what-is-a-redux-slice)
2. [Products Slice Explained](#products-slice-explained)
3. [Cart Slice Explained](#cart-slice-explained)
4. [Testing Slices](#testing-slices)

---

## What is a Redux Slice?

A **slice** is a collection of Redux logic for a single feature. Think of it like a container that holds:

- **State**: The data you want to store (like a list of products)
- **Reducers**: Functions that change the state (like adding a product)
- **Actions**: Commands that tell reducers what to do

Redux Toolkit's `createSlice` makes this easy by generating actions automatically!

---

## Products Slice Explained

**File:** `src/store/features/productsSlice.js`

### Imports (Line 1)

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
```

- `createSlice`: Creates a slice with state, reducers, and actions
- `createAsyncThunk`: Handles async operations like fetching data from APIs

### API URLs (Lines 3-5)

```javascript
const MENS_SHOES_URL = 'https://dummyjson.com/products/category/mens-shoes'
const WOMENS_SHOES_URL = 'https://dummyjson.com/products/category/womens-shoes'
```

We store URLs as constants at the top. This makes them easy to find and change later.

### Data Transformer (Lines 7-19)

```javascript
const transformShoeData = (shoe) => ({
  id: shoe.id,
  name: shoe.title,        // API uses "title", we use "name"
  price: shoe.price,
  category: shoe.category,
  stock: shoe.stock,
  image: shoe.thumbnail,   // API uses "thumbnail", we use "image"
  // ... more fields
})
```

**Why do we need this?** The API returns data in one format, but our app expects a different format. This function converts API data to our format.

### Async Thunk - Fetching Data (Lines 21-41)

```javascript
export const fetchShoes = createAsyncThunk(
  'products/fetchShoes',  // Action name
  async () => {
    // Step 1: Fetch men's shoes
    const mensResponse = await fetch(MENS_SHOES_URL)
    if (!mensResponse.ok) {
      throw new Error('Failed to fetch mens shoes')
    }
    const mensData = await mensResponse.json()

    // Step 2: Fetch women's shoes
    const womensResponse = await fetch(WOMENS_SHOES_URL)
    // ... same pattern

    // Step 3: Combine and transform
    const allShoes = [...mensData.products, ...womensData.products]
    return allShoes.map(transformShoeData)
  }
)
```

**What's happening:**
1. `createAsyncThunk` creates an action that can do async work
2. We fetch data from two URLs (men's and women's shoes)
3. We combine both lists into one array
4. We transform each shoe using our helper function
5. The returned data becomes the `action.payload`

### Initial State (Lines 43-50)

```javascript
const initialState = {
  products: [],           // Empty array - will hold our shoes
  loading: false,         // Are we currently fetching?
  error: null,            // Any error messages
  selectedCategory: 'all', // Current filter
  selectedBrand: 'all',
  selectedPriceRange: 'all'
}
```

This is the starting point for our state. When the app loads, these are the default values.

### Creating the Slice (Lines 52-97)

```javascript
const productsSlice = createSlice({
  name: 'products',       // Slice name (used in action types)
  initialState,           // Starting state
  reducers: {
    // Our reducer functions go here
  },
  extraReducers: (builder) => {
    // Handles async thunk states
  }
})
```

### Reducer: addProduct (Lines 55-61)

```javascript
addProduct: (state, action) => {
  const newProduct = {
    id: Date.now(),        // Generate unique ID using timestamp
    ...action.payload      // Spread all properties from the action
  }
  state.products.push(newProduct)  // Add to array
}
```

**How it works:**
- `state` = current state (the products array, etc.)
- `action.payload` = the data passed when calling the action
- We create a new product with a unique ID and add it to the array

### Reducer: updateProduct (Lines 63-70)

```javascript
updateProduct: (state, action) => {
  const { id, updates } = action.payload  // Destructure the payload
  const productIndex = state.products.findIndex(product => product.id === id)
  if (productIndex !== -1) {  // -1 means "not found"
    state.products[productIndex] = { 
      ...state.products[productIndex],  // Keep existing properties
      ...updates                         // Override with new values
    }
  }
}
```

**How it works:**
1. Find the product by ID
2. If found, merge the updates with existing data
3. If not found, do nothing

### Reducer: deleteProduct (Lines 72-75)

```javascript
deleteProduct: (state, action) => {
  state.products = state.products.filter(product => product.id !== action.payload)
}
```

**How it works:**
- `filter` creates a new array with only items that pass the test
- We keep all products EXCEPT the one with the matching ID

### Reducer: updateStock (Lines 77-83)

```javascript
updateStock: (state, action) => {
  const { id, quantity } = action.payload
  const product = state.products.find(product => product.id === id)
  if (product) {
    product.stock -= quantity  // Subtract the quantity
  }
}
```

Used when items are added to cart - decreases available stock.

### Filter Reducers (Lines 85-97)

```javascript
setSelectedCategory: (state, action) => {
  state.selectedCategory = action.payload
}
// Same pattern for brand and price range
```

Simple reducers that just update a single value.

### Extra Reducers - Handling Async States (Lines 99-113)

```javascript
extraReducers: (builder) => {
  builder
    .addCase(fetchShoes.pending, (state) => {
      state.loading = true    // Started fetching
      state.error = null      // Clear any previous errors
    })
    .addCase(fetchShoes.fulfilled, (state, action) => {
      state.loading = false   // Done fetching
      state.products = action.payload  // Store the products
      state.error = null
    })
    .addCase(fetchShoes.rejected, (state, action) => {
      state.loading = false   // Done (but failed)
      state.error = action.error.message  // Store error message
    })
}
```

**The three states of an async thunk:**
- `pending`: Request started, waiting for response
- `fulfilled`: Request succeeded, we have data
- `rejected`: Request failed, we have an error

### Exporting (Lines 115-124)

```javascript
export const {
  addProduct,
  updateProduct,
  deleteProduct,
  // ... etc
} = productsSlice.actions

export default productsSlice.reducer
```

- Export individual actions so components can use them
- Export the reducer so the store can use it

---

## Cart Slice Explained

**File:** `src/store/features/cartSlice.js`

### Initial State (Lines 3-7)

```javascript
const initialState = {
  items: [],      // Products in the cart
  total: 0,       // Total price
  itemCount: 0    // Number of unique items
}
```

### Reducer: addToCart (Lines 13-28)

```javascript
addToCart: (state, action) => {
  const { id, name, price } = action.payload
  const existingItem = state.items.find(item => item.id === id)
  
  if (existingItem) {
    existingItem.quantity += 1  // Already in cart? Add 1 more
  } else {
    state.items.push({          // New item? Add to cart
      id,
      name,
      price,
      quantity: 1
    })
  }
  
  cartSlice.caseReducers.calculateTotals(state)  // Recalculate totals
}
```

**Key concept:** We check if the item already exists. If yes, increase quantity. If no, add new item.

### Reducer: updateQuantity (Lines 30-43)

```javascript
updateQuantity: (state, action) => {
  const { id, quantity } = action.payload
  const item = state.items.find(item => item.id === id)
  
  if (item) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      state.items = state.items.filter(item => item.id !== id)
    } else {
      item.quantity = quantity
    }
  }
  
  cartSlice.caseReducers.calculateTotals(state)
}
```

### Reducer: decrementQuantity (Lines 63-73)

```javascript
decrementQuantity: (state, action) => {
  const item = state.items.find(item => item.id === action.payload)
  if (item) {
    if (item.quantity === 1) {
      // Last one? Remove the item entirely
      state.items = state.items.filter(item => item.id !== action.payload)
    } else {
      item.quantity -= 1
    }
  }
  cartSlice.caseReducers.calculateTotals(state)
}
```

**Smart behavior:** If quantity would become 0, we remove the item instead.

### Helper: calculateTotals (Lines 75-78)

```javascript
calculateTotals: (state) => {
  state.itemCount = state.items.length  // Count unique items
  state.total = state.items.reduce(
    (total, item) => total + (item.price * item.quantity), 
    0
  )
}
```

**What `reduce` does:**
- Loops through all items
- Multiplies each item's price by quantity
- Adds them all together
- Returns the sum

---

## Testing Slices

Testing ensures our code works correctly. We use **Vitest** as our test runner.

### Test File Structure

**File:** `src/store/features/productsSlice.test.js`

### Imports (Lines 1-11)

```javascript
import { describe, it, expect } from 'vitest'
import productsReducer, {
  addProduct,
  updateProduct,
  // ... other actions
} from './productsSlice'
```

- `describe`: Groups related tests together
- `it`: Defines a single test
- `expect`: Makes assertions (checks if something is true)

### Test Setup (Lines 13-30)

```javascript
const initialState = {
  products: [],
  loading: false,
  error: null,
  selectedCategory: 'all',
  selectedBrand: 'all',
  selectedPriceRange: 'all'
}

const mockProduct = {
  id: 1,
  name: 'Test Shoe',
  price: 99.99,
  category: 'mens-shoes',
  stock: 10,
  brand: 'Nike'
}
```

We create test data that we'll reuse across tests.

### Testing addProduct (Lines 36-44)

```javascript
describe('addProduct', () => {
  it('should add a new product to the list', () => {
    const newProduct = { name: 'New Shoe', price: 50 }
    const state = productsReducer(initialState, addProduct(newProduct))

    expect(state.products).toHaveLength(1)
    expect(state.products[0].name).toBe('New Shoe')
    expect(state.products[0].price).toBe(50)
  })
})
```

**How reducer testing works:**
1. Start with an initial state
2. Call the reducer with an action
3. Check if the new state is what we expected

### Testing updateProduct (Lines 46-68)

```javascript
it('should update an existing product', () => {
  // Start with one product in the list
  const stateWithProduct = { ...initialState, products: [mockProduct] }

  // Update the price
  const state = productsReducer(
    stateWithProduct,
    updateProduct({ id: 1, updates: { price: 79.99 } })
  )

  expect(state.products[0].price).toBe(79.99)
  expect(state.products[0].name).toBe('Test Shoe') // Other fields unchanged
})

it('should not change anything if product is not found', () => {
  // ... test with non-existent ID
  expect(state.products[0].price).toBe(99.99) // Price unchanged
})
```

**Good practice:** Test both success AND failure cases.

### Testing Async Thunks (Lines 100-127)

```javascript
describe('fetchShoes async thunk', () => {
  it('should set loading to true when fetch starts', () => {
    const state = productsReducer(initialState, { type: fetchShoes.pending.type })

    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('should store products when fetch succeeds', () => {
    const fetchedProducts = [mockProduct]

    const state = productsReducer(initialState, {
      type: fetchShoes.fulfilled.type,
      payload: fetchedProducts
    })

    expect(state.loading).toBe(false)
    expect(state.products).toEqual(fetchedProducts)
  })

  it('should store error message when fetch fails', () => {
    const state = productsReducer(initialState, {
      type: fetchShoes.rejected.type,
      error: { message: 'Failed to fetch' }
    })

    expect(state.loading).toBe(false)
    expect(state.error).toBe('Failed to fetch')
  })
})
```

**Testing async thunks:**
- We don't actually call the API
- We manually dispatch the `pending`, `fulfilled`, or `rejected` action
- We check if the state updates correctly for each case

---

## Cart Slice Tests

**File:** `src/store/features/cartSlice.test.js`

### Testing addToCart (Lines 18-40)

```javascript
it('should add a new item to empty cart', () => {
  const state = cartReducer(initialState, addToCart(mockProduct))
  
  expect(state.items).toHaveLength(1)
  expect(state.items[0].quantity).toBe(1)
  expect(state.total).toBe(100)
  expect(state.itemCount).toBe(1)
})

it('should increment quantity if item already exists', () => {
  const stateWithItem = {
    items: [{ id: 1, name: 'Test Shoe', price: 100, quantity: 1 }],
    total: 100,
    itemCount: 1
  }
  const state = cartReducer(stateWithItem, addToCart(mockProduct))
  
  expect(state.items).toHaveLength(1)      // Still 1 item
  expect(state.items[0].quantity).toBe(2)  // But quantity is 2
  expect(state.total).toBe(200)            // Total doubled
  expect(state.itemCount).toBe(1)          // Still 1 unique item
})
```

### Testing Edge Cases (Lines 56-67)

```javascript
it('should remove item if quantity is 0 or less', () => {
  const stateWithItem = {
    items: [{ id: 1, name: 'Test Shoe', price: 100, quantity: 1 }],
    total: 100,
    itemCount: 1
  }
  const state = cartReducer(stateWithItem, updateQuantity({ id: 1, quantity: 0 }))
  
  expect(state.items).toHaveLength(0)  // Item removed!
  expect(state.total).toBe(0)
  expect(state.itemCount).toBe(0)
})
```

**Edge cases** are unusual situations that might break your code. Always test them!

---

## Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode (re-runs when files change)
npm run test:watch
```

---

## Summary

| Concept | What it does |
|---------|--------------|
| `createSlice` | Creates state + reducers + actions in one place |
| `createAsyncThunk` | Handles async operations (API calls) |
| `initialState` | Starting values for your state |
| `reducers` | Functions that modify state |
| `extraReducers` | Handles async thunk states (pending/fulfilled/rejected) |
| `action.payload` | Data passed to the reducer |
| `describe/it/expect` | Testing functions from Vitest |

Happy coding! 🎉
