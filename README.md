# retail-fsr-app

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/jeremyyuAWS/retail-fsr-app)

## Troubleshooting

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
