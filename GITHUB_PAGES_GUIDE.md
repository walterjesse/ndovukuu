# 🚀 How to Deploy Ndovukuu to GitHub Pages

I have pre-configured everything for you! This repository includes a **GitHub Actions Workflow** (`.github/workflows/deploy.yml`) which will automatically build and publish your website to GitHub Pages every time you push code to GitHub.

Here is the easiest, step-by-step guide to get your site online in 5 minutes.

---

## Step 1: Create a Repository on GitHub
1. Go to [github.com](https://github.com) and log in.
2. Click the **New** button (or go to [github.com/new](https://github.com/new)).
3. Name your repository (e.g., `ndovukuu`).
4. Set it to **Public** (required for free GitHub Pages).
5. **Do NOT** check "Add a README", "Add .gitignore", or "Choose a license" (we already have these files).
6. Click **Create repository**.

---

## Step 2: Push your Code to GitHub
Open your terminal/command prompt in this project folder and run the following commands:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Add all files to staging
git add .

# 3. Create your first commit
git commit -m "Initial commit: Ndovukuu Phone Repairs & Sales"

# 4. Rename the default branch to main
git branch -M main

# 5. Link your local folder to GitHub (Replace with your actual GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/ndovukuu.git

# 6. Push your code!
git push -u origin main
```

*(Note: Replace `YOUR_USERNAME` with your actual GitHub username!)*

---

## Step 3: Enable Pages in GitHub Settings
Once your code is pushed, tell GitHub to use the automated workflow:

1. On your GitHub repository page, click the **Settings** tab (gear icon at the top).
2. On the left sidebar, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment** -> **Source**, change the dropdown from **Deploy from a branch** to **GitHub Actions**.
4. That's it! 

---

## Step 4: Watch it Go Live! 🐘
1. Click the **Actions** tab at the top of your GitHub repository.
2. You will see a workflow running called **"Deploy to GitHub Pages"**.
3. Once it turns green, click on the deploy job, and you will see your live website link! 
   *(The URL will look like: `https://YOUR_USERNAME.github.io/ndovukuu/`)*

---

## 💡 Good to Know
- **Zero Config needed:** Since the project uses `vite-plugin-singlefile`, all your styles and javascript are embedded inside a single `index.html`. You don't have to worry about broken paths or complex configurations.
- **Auto-Updates:** Whenever you make changes locally or add new phones through code, just run:
  ```bash
  git add .
  git commit -m "Update"
  git push
  ```
  GitHub will automatically rebuild and deploy the updates in less than a minute!
