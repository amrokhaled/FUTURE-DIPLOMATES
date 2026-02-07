# Deploying Your Future Diplomats App (SSR Version)

Because we switched to **Server-Side Rendering (SSR)** to fix the Authentication and Admin Panel issues, you can no longer just "upload a folder" to Netlify Drop. You must deploy using **Git** or the **Netlify CLI** so that the server-side code (Middleware & API Routes) runs correctly.

## Option 1: The Recommended Way (Git & GitHub)
This is the standard way to host Next.js apps on Netlify. It ensures your site updates automatically when you push code.

### 1. Initialize Git (if not already done)
Open your terminal in the project folder and run:
```bash
git init
git add .
git commit -m "Initial commit with SSR fixes"
```

### 2. Push to GitHub
1.  Create a new repository on GitHub (e.g., `future-diplomats-2026`).
2.  Follow the instructions to push your local code:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/future-diplomats-2026.git
    git branch -M main
    git push -u origin main
    ```

### 3. Connect to Netlify
1.  Log in to [Netlify](https://app.netlify.com).
2.  Click **"Add new site"** > **"Import from existing project"**.
3.  Choose **GitHub** and select your `future-diplomats-2026` repository.
4.  **Build Settings:**
    *   **Build command:** `npm run build`
    *   **Publish directory:** `.next`
5.  **Environment Variables (Crucial!):**
    Click on **"Show advanced"** or go to **Site settings > Environment variables** after creation and add:
    *   `NEXT_PUBLIC_SUPABASE_URL`: (Your Supabase URL)
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
6.  Click **Deploy**.

---

## Option 2: The "Manual Upload" Way (Netlify CLI)
If you don't want to use GitHub right now, you can upload directly from your terminal.

1.  Run the deploy command:
    ```bash
    npx netlify-cli deploy --prod
    ```
    *(If it asks to install `netlify-cli`, say yes)*

2.  Follow the prompts:
    *   **Link to existing site?** No (create a new one) or Yes (if you have one).
    *   **Team:** Select your team.
    *   **Site name:** Choose a name (or leave blank).
    *   **Publish directory:** `.next` (It might auto-detect, but ensure it's `.next`).
    *   **Functions directory:** Press Enter (default).

3.  **Important:** You must still set the Environment Variables in the Netlify Dashboard (Site Settings > Environment variables) for the login to work!

---
**Why this change?**
Static sites (dragging a folder) cannot securely check cookies or hide admin pages. By using SSR, we made the app secure and professional.
