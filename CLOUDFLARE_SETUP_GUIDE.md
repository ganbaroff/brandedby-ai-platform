# 🎯 Cloudflare Setup - Quick Visual Guide

## Complete 3-Step Setup (Takes 10 minutes)

---

## STEP 1: Get API Token ✅

### Go to:

```
https://dash.cloudflare.com/profile/api-tokens
```

### Click "Create Token" button (top right)

### You'll see options. Choose ONE:

#### 🟢 OPTION A: Use Template (RECOMMENDED - 30 sec)

1. Find template: **"Edit Cloudflare Workers"**
2. Click the button next to it
3. You'll see a summary
4. Click blue **"Create Token"** button
5. ✅ Copy the token (long string that starts with)

#### 🟡 OPTION B: Custom Token (if Option A doesn't work)

1. Click **"Create Custom Token"**
2. Fill in:
   - **Name:** `BrandedBy GitHub Deploy`
   - **Permissions:** `Cloudflare Pages - Edit`
   - **Account:** `All Accounts`
   - **TTL:** Leave as "Never" or set to 2026
3. Click **"Create Token"**
4. ✅ Copy the long token string

---

## STEP 2: Get Account ID ✅

### Go to:

```
https://dash.cloudflare.com/
```

### Look in the LEFT SIDEBAR

You'll see near the bottom:

```
Account ID: (some number like abc123def456)
```

Click the copy icon or select all text
✅ Copy your Account ID

---

## STEP 3: Add to GitHub Secrets ✅

### Go to your repository:

```
https://github.com/ganbaroff/brandedby-ai-platform
```

### Path: Settings → Secrets and variables → Actions

### Click "New repository secret" (green button, top right)

### Add FIRST Secret:

```
Name: CLOUDFLARE_API_TOKEN
Value: (paste the token from STEP 1)
```

Click "Add secret"

### Add SECOND Secret:

```
Name: CLOUDFLARE_ACCOUNT_ID
Value: (paste the ID from STEP 2)
```

Click "Add secret"

✅ **Done! Both secrets added**

---

## STEP 4: Create Cloudflare Pages Project ✅

### Go back to:

```
https://dash.cloudflare.com/
```

### Click "Pages" in left sidebar

### Click "Create a project"

### Click "Connect to Git"

### Select your repository:

```
brandedby-ai-platform
```

### Accept GitHub permission (if prompted)

### Fill in Build Settings:

| Field                      | Value             |
| -------------------------- | ----------------- |
| **Framework preset**       | None              |
| **Build command**          | `npm run build`   |
| **Build output directory** | `dist/client`     |
| **Root directory**         | `/` (leave empty) |
| **Environment variables**  | (leave empty)     |

### Click "Save and Deploy"

### ✅ Your site is deploying!

---

## 🎉 YOU'RE DONE!

### You'll get:

```
Your site is live at:
https://brandedby.pages.dev
```

Or if you changed the project name:

```
https://[your-project-name].pages.dev
```

---

## 📊 What Happens Next

✅ **Every time you push to main branch:**

1. GitHub Actions runs automatically
2. Tests verify everything works
3. Build is created
4. Deployed to Cloudflare Pages
5. Your site updates automatically

✅ **No additional steps needed!**

---

## 🆘 Troubleshooting

### Problem: "Token not found" error in GitHub Actions

**Solution:**

- Go back to Step 3
- Make sure you added BOTH secrets
- Secret names must be EXACTLY:
  - `CLOUDFLARE_API_TOKEN` ✅
  - `CLOUDFLARE_ACCOUNT_ID` ✅

### Problem: "Invalid token" error

**Solution:**

- Copy the FULL token from Step 1 (it's very long)
- Make sure you didn't accidentally add spaces
- Try creating a new token

### Problem: Build fails

**Solution:**

- Check GitHub Actions tab (in your repo)
- Click the failed workflow
- See the error message
- Usually it's a missing dependency - fix and push again

### Problem: Site shows "404 Not Found"

**Solution:**

- Wait 2-3 minutes for deployment to complete
- Try refreshing the page (Ctrl+F5)
- Check Cloudflare Pages deployment status

---

## ✨ Final Checklist

- [ ] Created API Token in Cloudflare
- [ ] Copied Account ID from Cloudflare
- [ ] Added both secrets to GitHub
- [ ] Created Cloudflare Pages project
- [ ] Project is connected to your GitHub repo
- [ ] Build settings are configured correctly
- [ ] First deployment completed
- [ ] Site is accessible at brandedby.pages.dev

✅ **All done! Your site is live!**

---

## 📚 Quick Reference

| What               | Where                                                                       |
| ------------------ | --------------------------------------------------------------------------- |
| Create Token       | https://dash.cloudflare.com/profile/api-tokens                              |
| Get Account ID     | https://dash.cloudflare.com/                                                |
| Add GitHub Secrets | https://github.com/ganbaroff/brandedby-ai-platform/settings/secrets/actions |
| Cloudflare Pages   | https://dash.cloudflare.com/pages                                           |
| Your Live Site     | https://brandedby.pages.dev                                                 |

---

**Need more help? Check the detailed guide in API_TOKEN_GUIDE.md**
