# Fintech Dashboard Frontend

This is the frontend application for the Fintech Dashboard, built with vanilla HTML, CSS, and JavaScript.

## Features

- **Modern UI/UX**: Clean, responsive design with gradient backgrounds and smooth animations
- **Authentication**: Login and signup functionality with JWT token storage
- **Dashboard**: Real-time balance and transaction display
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error messages and loading states

## File Structure

```
client/
├── index.html          # Landing page with auto-redirect
├── login.html          # Login page
├── signup.html         # Signup page
├── dashboard.html      # Main dashboard
├── js/
│   └── main.js         # Main JavaScript file with all functionality
└── README.md           # This file
```

## Deployment Instructions

### Deploy to Vercel

1. **Push to GitHub**: Make sure your code is in a GitHub repository
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your repository
   - Set the root directory to `client/`
   - Click "Deploy"

3. **Set Environment Variables**:
   - In your Vercel project dashboard, go to Settings → Environment Variables
   - Add the following variable:
     - **Name**: `BACKEND_API_URL`
     - **Value**: Your backend API URL (e.g., `https://your-backend.vercel.app/api`)
   - Click "Save"

4. **Redeploy**: After setting environment variables, redeploy your project

### Deploy to Netlify

1. **Push to GitHub**: Make sure your code is in a GitHub repository
2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with your GitHub account
   - Click "New site from Git"
   - Choose your repository
   - Set the publish directory to `client/`
   - Click "Deploy site"

3. **Set Environment Variables**:
   - In your Netlify dashboard, go to Site settings → Environment variables
   - Add the following variable:
     - **Key**: `BACKEND_API_URL`
     - **Value**: Your backend API URL
   - Click "Save"

4. **Redeploy**: After setting environment variables, trigger a new deployment

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BACKEND_API_URL` | Your backend API base URL | `https://your-backend.vercel.app/api` |

## API Endpoints Used

- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `GET /dashboard/dashboard` - Get user dashboard data
- `GET /transactions` - Get user transactions
- `POST /transactions` - Make a transaction
- `POST /profile` - Update user profile

## Local Development

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd fintech-dashboard/client
   ```

2. **Update the backend URL**:
   - Open `js/main.js`
   - Update the `BACKEND_API_URL` constant to point to your local backend

3. **Serve the files**:
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:3000
   ```

4. **Open in browser**: Navigate to `http://localhost:3000`

## Testing the Integration

1. **Create an account**: Use the signup page to create a new account
2. **Login**: Use your credentials to log in
3. **Dashboard**: Verify that the dashboard loads with your account information
4. **Transactions**: Test making transactions and viewing transaction history
5. **Profile**: Test updating your profile information

## Troubleshooting

### CORS Errors
- Ensure your backend CORS configuration allows requests from your frontend domain
- Check that the `BACKEND_API_URL` environment variable is set correctly

### Authentication Issues
- Clear browser localStorage and try logging in again
- Check that JWT tokens are being stored correctly
- Verify backend authentication endpoints are working

### Deployment Issues
- Ensure the `client/` directory is set as the root directory in your deployment platform
- Check that environment variables are set correctly
- Verify that all files are being served correctly

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is part of the Fintech Dashboard application. 