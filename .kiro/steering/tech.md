# Technology Stack

## Build System & Framework
- **Vite** - Build tool and development server
- **React 19.2.0** - UI framework with modern JSX transform
- **ES Modules** - Modern JavaScript module system

## State Management
- **Redux Toolkit** - State management with createSlice and createAsyncThunk
- **React Redux** - React bindings for Redux

## Testing
- **Vitest** - Test runner with jsdom environment
- **Testing Library** - React component testing utilities
- **Redux Mock Store** - For testing Redux components

## Code Quality
- **ESLint** - Linting with React hooks and refresh plugins
- **React Icons** - Icon library

## External APIs
- **DummyJSON API** - Product data source for shoes

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run preview      # Preview production build
```

### Building
```bash
npm run build        # Build for production
```

### Testing
```bash
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

## Configuration Notes
- Vite config includes React plugin and Vitest setup
- ESLint configured for modern React with hooks
- Test setup uses jsdom environment for DOM testing
- Redux store configured with products and cart slices