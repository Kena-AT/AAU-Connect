# Deploying AAU Connect to Render

Follow these steps to deploy the application as a Static Site on Render.

## Prerequisites
1.  Push your code to a Git repository (GitHub, GitLab, or Bitbucket).

## Deployment Steps

1.  **Log in to Render**
    - Go to [dashboard.render.com](https://dashboard.render.com/).

2.  **Create a New Static Site**
    - Click **New +** and select **Static Site**.

3.  **Connect Your Repository**
    - Search for your `AAU-Connect` repository and click **Connect**.

4.  **Configure Build Settings**
    - Use the following settings:
        - **Name**: `aau-connect` (or your preferred name)
        - **Branch**: `main` (or your working branch)
        - **Root Directory**: `Frontend` (IMPORTANT: Since your angular app is inside the Frontend folder)
        - **Build Command**: `npm install && npm run build`
        - **Publish Directory**: `dist/connect-frontend/browser`

5.  **Add Rewrite Rule (Crucial for Angular Routing)**
    - Scroll down to **Redirects/Rewrites**.
    - Click **Add Rule**.
    - **Source**: `/*`
    - **Destination**: `/index.html`
    - **Action**: `Rewrite`
    - *Explanation: This ensures that when users refresh a page (like /dashboard/feed), Render serves the index.html so Angular can handle the routing, instead of returning a 404.*

6.  **Deploy**
    - Click **Create Static Site**.

## Troubleshooting
- **404 on Refresh**: Ensure you added the Rewrite Rule from Step 5.
- **Build Failed**: Check the logs. If it says it can't find `package.json`, make sure you set the **Root Directory** to `Frontend`.
- **White Screen**: Check the console for errors. Ensure `base href` is correct (usually `/` is fine for root domains).
