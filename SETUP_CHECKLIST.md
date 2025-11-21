# ✅ Cloudflare Pages Setup Checklist

**Time estimate: 10 minutes**

---

## BEFORE YOU START
- [ ] You have a GitHub account
- [ ] You have access to https://github.com/ganbaroff/brandedby-ai-platform
- [ ] You can create a Cloudflare account

---

## ALTERNATIVE: Quick Vercel Deploy (1–2 minutes)

If you prefer to avoid Cloudflare API tokens and Account IDs, deploy to Vercel — it automatically builds from GitHub and provides preview URLs for PRs.

- Steps (short):
   1. Go to https://vercel.com and sign in with GitHub.
   2. Import repository `ganbaroff/brandedby-ai-platform`.
   3. Set Build Command: `npm run build` and Output Directory: `dist/client`.
   4. Add any needed Environment Variables in Vercel dashboard.
   5. Click Deploy. See full steps: [`VERCEL_SETUP.md`](./VERCEL_SETUP.md)

---

---

## PHASE 1: Cloudflare Account Setup (3 minutes)

### Step 1: Create Cloudflare Account
- [ ] Go to https://dash.cloudflare.com/sign-up
- [ ] Sign up with your email
- [ ] Verify email
- [ ] Complete account setup

### Step 2: Get API Token
- [ ] Go to https://dash.cloudflare.com/profile/api-tokens
- [ ] Click "Create Token" button
- [ ] Choose "Edit Cloudflare Workers" template
  - [ ] Or create custom token with "Cloudflare Pages - Edit" permission
- [ ] Click "Create Token"
- [ ] **COPY THE FULL TOKEN** (very long string)
- [ ] Save it somewhere safe (notepad, etc.)

### Step 3: Get Account ID
- [ ] Go to https://dash.cloudflare.com/
- [ ] Look in LEFT SIDEBAR
- [ ] Find "Account ID" (bottom area usually)
- [ ] **COPY THE ACCOUNT ID**
- [ ] Save it (next to the token)

✅ **Phase 1 complete! You now have:**
```
✓ API Token (long string)
✓ Account ID (short alphanumeric)
```

---

## PHASE 2: GitHub Secrets Setup (2 minutes)

### Step 1: Go to GitHub Settings
- [ ] Open https://github.com/ganbaroff/brandedby-ai-platform
- [ ] Click Settings tab (top menu)
- [ ] Left sidebar → Secrets and variables → Actions

### Step 2: Add First Secret (API Token)
- [ ] Click "New repository secret" (green button, top right)
- [ ] Name: `CLOUDFLARE_API_TOKEN` (EXACTLY)
- [ ] Value: (paste the API token from Phase 1, Step 2)
- [ ] Click "Add secret"

### Step 3: Add Second Secret (Account ID)
- [ ] Click "New repository secret" (green button)
- [ ] Name: `CLOUDFLARE_ACCOUNT_ID` (EXACTLY)
- [ ] Value: (paste the Account ID from Phase 1, Step 3)
- [ ] Click "Add secret"

✅ **Phase 2 complete! GitHub now has your secrets**

---

## PHASE 3: Cloudflare Pages Project (3 minutes)

### Step 1: Create Pages Project
- [ ] Go to https://dash.cloudflare.com/
- [ ] Left sidebar → Click "Pages"
- [ ] Click "Create a project" button
- [ ] Click "Connect to Git"

### Step 2: Connect GitHub
- [ ] Select "GitHub" as your git provider
- [ ] Authorize Cloudflare to access your GitHub
- [ ] Select repository: `brandedby-ai-platform`
- [ ] Click "Connect"

### Step 3: Configure Build Settings
- [ ] Framework preset: **None**
- [ ] Build command: `npm run build`
- [ ] Build output directory: `dist/client`
- [ ] Root directory: (leave empty)
- [ ] Environment variables: (leave empty)
- [ ] Click "Save and Deploy"

✅ **Phase 3 complete! Deployment started**

---

## PHASE 4: Verify Deployment (2 minutes)

### Step 1: Wait for Build
- [ ] Cloudflare Pages will start building
- [ ] Wait 2-3 minutes for completion
- [ ] You'll see "Deployment successful" message

### Step 2: Get Your URL
- [ ] Your site URL will be shown in Cloudflare Pages
- [ ] Usually: `https://brandedby.pages.dev`
- [ ] Click the link to visit your live site

### Step 3: Verify Tests Ran
- [ ] Go back to GitHub repo
- [ ] Click "Actions" tab
- [ ] You should see a workflow that ran
- [ ] It should show green ✅ (passed)

✅ **Phase 4 complete! Your site is LIVE!**

---

## 🎉 FINAL RESULT

```
Your site is now live at:
https://brandedby.pages.dev

Every time you push to GitHub:
✅ Tests run automatically
✅ Build happens automatically  
✅ Site updates automatically
```

---

## ⚠️ COMMON MISTAKES TO AVOID

❌ **Don't:**
- Copy only part of the API token
- Add spaces before/after the token
- Use different secret names (must be EXACT)
- Forget to click "Add secret" after entering values
- Use the wrong GitHub repository

✅ **Do:**
- Copy the FULL token (it's very long)
- Double-check secret names are EXACTLY correct
- Make sure both secrets are added
- Wait 2-3 minutes for first deployment
- Check GitHub Actions if something fails

---

## 🆘 IF SOMETHING GOES WRONG

### Workflow/Build Failed?
1. Go to GitHub repo → Actions tab
2. Click the failed workflow
3. Scroll down to see error message
4. Fix the issue and push again

### Can't find API Token page?
1. Make sure you're logged into Cloudflare
2. Go to https://dash.cloudflare.com/profile/api-tokens
3. If "Create Token" button doesn't show, refresh page

### Secrets not working?
1. Go to Settings → Secrets and variables → Actions
2. Make sure you see both secrets listed:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
3. If not, add them again

### Site shows 404 error?
1. Make sure deployment completed (check Pages dashboard)
2. Refresh browser (Ctrl+F5)
3. Wait another minute
4. Try again

---

## 📞 Need Help?

If something is still not working:
1. Check the detailed guides:
   - `CLOUDFLARE_SETUP_GUIDE.md` (visual guide)
   - `API_TOKEN_GUIDE.md` (token details)
2. Check GitHub Actions for error messages
3. Make sure all steps were followed in order

---

## ✨ You're All Set!

Your site is now:
- ✅ Hosted on Cloudflare Pages (FREE)
- ✅ Auto-deploying from GitHub
- ✅ Protected by SSL (HTTPS)
- ✅ Cached globally (fast everywhere)
- ✅ Getting automatic tests before deploy

**Congratulations! 🎉**
