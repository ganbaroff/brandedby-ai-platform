# 🔐 Cloudflare API Token Creation - Detailed Guide

## Step-by-Step: Creating the Perfect API Token

### Location:

```
https://dash.cloudflare.com/profile/api-tokens
```

### Click "Create Token" Button

You'll see a form with these options:

---

## ✅ RECOMMENDED SETTINGS

### Option 1: Use Template (EASIEST - 30 seconds)

**1. Click "Edit Cloudflare Workers"**

- This is a pre-configured template
- It already has the right permissions

**Then click "Create Token"**

- ✅ Done! Copy the token and save it

---

### Option 2: Manual Configuration (If you want to customize)

**If you click "Create Custom Token" instead, set these parameters:**

#### Section 1: Token Name

```
Name: "BrandedBy GitHub Deploy"
```

#### Section 2: Permissions

Add these permissions:

✅ **Account**

- Cloudflare Pages - Edit

✅ **Account Resources**

- Include - All accounts
- ✓ Check if available

#### Section 3: TTL (Time To Live)

```
Start date: Today
End date: Never (or set to future date like 2026-12-31)
```

#### Section 4: Client IP Address Filtering

```
Leave EMPTY (no restrictions)
```

#### Section 5: API Token Status

```
Make sure it says: "Active"
```

---

## 🎯 FINAL SETTINGS CHECKLIST

| Setting            | Value                         |
| ------------------ | ----------------------------- |
| **Token Name**     | "BrandedBy GitHub Deploy"     |
| **Permissions**    | Cloudflare Pages - Edit       |
| **Account**        | All Accounts                  |
| **TTL**            | Never expire (or set to 2026) |
| **IP Restriction** | None                          |
| **Status**         | Active ✅                     |

---

## 📋 What You'll Get

After clicking "Create Token", you'll see:

```
Token: z1d92-_kHds92n_sd9n2dJSNdjn2sd9JDN...
(This is a very long string - copy ALL of it!)
```

---

## 🔒 SECURITY NOTES

⚠️ **IMPORTANT:**

- ❌ Never share this token publicly
- ❌ Never commit it to GitHub (we use Secrets)
- ✅ Store it safely for next step
- ✅ Can always regenerate if leaked

---

## 📝 What to do next

1. **Copy the entire token** (the long string)
2. Go to GitHub: https://github.com/ganbaroff/brandedby-ai-platform/settings/secrets/actions
3. Click "New repository secret"
4. Name: `CLOUDFLARE_API_TOKEN`
5. Paste the token as the value
6. Click "Add secret"

✅ Done!

---

## 🆘 Having Issues?

If you see an error like "Insufficient permissions":

- Make sure you selected "Cloudflare Pages - Edit"
- Make sure "All accounts" is selected
- Try the template instead (Option 1 above)

If you don't see Cloudflare Pages option:

- Your account might need to enable Pages first
- Visit https://dash.cloudflare.com/ and click "Pages" to enable it

---

**Next: Get your Account ID**

```
https://dash.cloudflare.com/
(look in left sidebar, usually bottom section)
```
