# LocalsLocalMarket — Frontend (React + Vite)

**Developer:** Danrave Keh  
**Email:** danrave.keh@localslocalmarket.com

This is the frontend application for LocalsLocalMarket, a local marketplace platform connecting businesses with their communities. Built with React and Vite for optimal performance and developer experience.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration
## Backend API configuration

The app automatically configures API endpoints:

- **Development**: Uses `/api` with Vite proxy to `http://localhost:8080`
- **Production**: Uses `https://api.localslocalmarket.com/api`

You can override with environment variable:

```
VITE_API_BASE=https://your-api-domain.com/api
```

To enable production logging, set:

```
VITE_ENABLE_LOGS=true
```


If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
