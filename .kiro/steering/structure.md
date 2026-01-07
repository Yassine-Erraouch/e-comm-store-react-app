# Project Structure

## Root Level
- `src/` - Main application source code
- `public/` - Static assets served directly
- `dist/` - Production build output (generated)
- `node_modules/` - Dependencies (generated)
- Configuration files: `package.json`, `vite.config.js`, `eslint.config.js`

## Source Code Organization (`src/`)

### Main Application
- `main.jsx` - Application entry point with Redux Provider
- `App.jsx` - Root component with main layout
- `App.css` - Global application styles
- `index.css` - Base CSS styles

### Components (`src/components/`)
- Component files use PascalCase naming (e.g., `ProductCard.jsx`)
- Each component has a corresponding test file (e.g., `ProductCard.test.jsx`)
- Component-specific CSS files when needed (e.g., `Cart.css`)

### State Management (`src/store/`)
- `store.js` - Redux store configuration
- `features/` - Redux slices organized by domain
  - `cartSlice.js` - Shopping cart state and actions
  - `productsSlice.js` - Product catalog state and async thunks

### Testing (`src/test/`)
- `setup.js` - Test environment configuration

### Assets (`src/assets/`)
- Static assets like images and icons

## Naming Conventions

### Files
- React components: PascalCase (e.g., `ProductCard.jsx`)
- Redux slices: camelCase with "Slice" suffix (e.g., `cartSlice.js`)
- Test files: Component name + `.test.jsx`
- CSS files: Match component name or use kebab-case

### Code
- Components: PascalCase
- Functions/variables: camelCase
- Redux actions: camelCase descriptive names
- CSS classes: kebab-case

## Architecture Patterns

### Component Structure
- Functional components with hooks
- Redux state access via `useSelector` and `useDispatch`
- Props destructuring in component parameters
- Event handlers prefixed with "handle" (e.g., `handleAddToCart`)

### Redux Organization
- Feature-based slices in separate files
- Async operations use `createAsyncThunk`
- State normalization for complex data
- Actions follow CRUD patterns (create, read, update, delete)

### Testing Structure
- Test files co-located with components
- Mock Redux store for component testing
- Descriptive test names following "should [behavior]" pattern
- Use Testing Library queries and user events