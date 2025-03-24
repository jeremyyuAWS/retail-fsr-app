# retail-fsr-app

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/jeremyyuAWS/retail-fsr-app)

## Local Development and Testing

### Running the App Locally

1. **Start Development Server**
   - Run the app in development mode with hot-reload:
   ```bash
   npm run dev
   ```
   - This will start the development server, typically at http://localhost:5173

2. **Build for Production**
   - Create an optimized production build:
   ```bash
   npm run build
   ```
   - This generates static files in the `dist` directory

3. **Preview Production Build**
   - Test the production build locally:
   ```bash
   npm run preview
   ```
   - This serves the production build, typically at http://localhost:4173

### Testing with Netlify

1. **Install Netlify CLI** (if not already installed)
   ```bash
   npm install netlify-cli -g
   ```

2. **Test Netlify Deployment Locally**
   ```bash
   netlify dev
   ```
   - This simulates the Netlify production environment locally

3. **Create a Production Build and Test with Netlify**
   ```bash
   npm run build
   netlify deploy --dir=dist
   ```
   - This creates a draft deployment you can preview before publishing

## Troubleshooting

### Local Build Issues

If you encounter issues with the local development or build process:

1. **Check Node.js Version**
   - Ensure you're using a compatible Node.js version
   - This project works best with Node.js 16.x or later

2. **Verify Environment Variables**
   - Make sure all required environment variables are set
   - For local development, create a `.env` file based on `.env.example`

3. **Port Conflicts**
   - If you see "Port already in use" errors, change the port:
   ```bash
   npm run dev -- --port=3000
   ```

### Build Error with lucide-react

If you encounter build errors related to lucide-react, particularly with 'forwardRef' exports, follow these steps:

1. **Verify Dependency Versions**
   - Ensure you have the correct versions of React (^18.2.0) and lucide-react (^0.294.0) installed
   - Check package.json to confirm the versions match the project requirements

2. **Check Vite Configuration**
   - Verify that the Vite configuration includes the proper alias resolution for React:
   ```js
   resolve: {
     alias: {
       'react': path.resolve(__dirname, 'node_modules/react')
     }
   }
   ```

3. **Clean Dependencies**
   - If issues persist, try cleaning and reinstalling dependencies:
   ```bash
   rm -rf node_modules
   npm install
   ```

4. **Update Browserslist Database**
   - Run the following command to update the browserslist database:
   ```bash
   npx update-browserslist-db@latest
   ```
   - Alternatively, use the npm script:
   ```bash
   npm run update-browsers
   ```
