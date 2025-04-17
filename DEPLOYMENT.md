# Deploying ResumeAI on Render.com

This guide provides step-by-step instructions for deploying the ResumeAI application with separate frontend and backend services on Render.com.

## Prerequisites

- A [Render.com](https://render.com) account
- Git repository with your ResumeAI code
- Supabase account for database and storage
- OpenAI API key for AI functionalities

## Deployment Steps

### 1. Deploy the Backend Service

1. Login to your Render dashboard
2. Navigate to "New +" → "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `resumeai-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm ci`
   - **Start Command**: `npm start`
   - **Plan**: Choose an appropriate plan (at least the Standard plan for production)

5. Add the required environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render assigns this port in production)
   - `DATABASE_URL`: Your Supabase PostgreSQL connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - `JWT_EXPIRE`: `30d` (or your preferred expiration time)
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_KEY`: Your Supabase service role key
   - `CORS_ORIGIN`: Initially leave blank (will update after frontend deployment)

6. Click "Create Web Service"

### 2. Deploy the Frontend Service

1. In your Render dashboard, go to "New +" → "Web Service"
2. Connect your Git repository (same as backend)
3. Configure the service:
   - **Name**: `resumeai-frontend`
   - **Root Directory**: `frontend`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose an appropriate plan

4. Add the required environment variables:
   - `NODE_ENV`: `production`
   - `NEXT_PUBLIC_BACKEND_URL`: The URL of your backend service (from step 1)
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

5. Click "Create Web Service"

### 3. Update CORS Settings for Backend

After the frontend is deployed, you need to update the backend's CORS settings:

1. Go to your backend service in Render dashboard
2. Navigate to "Environment" tab
3. Add/update the `CORS_ORIGIN` variable with your frontend URL (e.g., `https://resumeai-frontend.onrender.com`)
4. Click "Save Changes" and the service will redeploy automatically

### 4. Set Up Render Blueprint (Optional)

For easier future deployments, you can set up a Render Blueprint:

1. Add both `render.yaml` files to your repository
2. In Render dashboard, go to "Blueprints" → "New Blueprint Instance"
3. Select your repository and follow the instructions

## Testing Your Deployment

1. Visit your frontend URL
2. Test the login functionality
3. Try uploading a resume for analysis
4. Check that the backend API is correctly processing requests

## Troubleshooting

### CORS Issues

If you encounter CORS errors:
- Verify the `CORS_ORIGIN` in your backend settings matches the exact frontend URL
- Check the Network tab in browser DevTools to see the actual CORS error details

### Connection Issues

If the frontend can't connect to the backend:
- Confirm the `NEXT_PUBLIC_BACKEND_URL` is correct
- Ensure the backend service is running
- Check backend logs for any errors

### Build Failures

If your build fails:
- Check the build logs for specific errors
- Ensure all dependencies are properly specified in package.json
- Verify that environment variables are correctly set

## Scaling Considerations

As your application grows:
1. Consider upgrading your Render plans for more resources
2. Set up a dedicated database service instead of using Supabase directly
3. Implement caching strategies for frequently accessed data
4. Consider using a CDN for static assets 