# 🔍 Mapbox Request Blocking - Debugging Guide

Based on [Mapbox API Documentation](https://docs.mapbox.com/api/guides/)

---

## 🚨 Common Reasons Requests Get Blocked

### 1. **Invalid Access Token** (HTTP 401)

According to [Mapbox's Access Token docs](https://docs.mapbox.com/api/guides/#access-tokens-and-token-scopes):

> You must supply a valid access token by using the `access_token` query parameter in every request.

**Check:**
- Open browser console (`F12`)
- Look for the 🔑 **Mapbox Token Status** log
- Verify `isValid: true` (token starts with `pk.`)
- Verify `fromEnv: true` (loaded from .env.local)

**Fix:**
```bash
# Check your .env.local file
cat .env.local

# Should contain:
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiYWxkaS0yMyIsImEiOiJjbWhyZWJwZDMwd2k3MmtzNDRlMjJpeWVnIn0.Pi2JqSiMdQs5SrT70vhI-g
```

**Verify token is valid:**
```bash
# Test your token directly
curl "https://api.mapbox.com/styles/v1/mapbox/dark-v11?access_token=YOUR_TOKEN_HERE"
```

---

### 2. **Rate Limit Exceeded** (HTTP 429)

Per [Mapbox Rate Limits](https://docs.mapbox.com/api/guides/#rate-limits):

| API | Rate Limit |
|-----|-----------|
| Styles API | 2,000 requests/min |
| Raster Tiles | 100,000 requests/min |
| Vector Tiles | 100,000 requests/min |

**Check Response Headers:**
```
X-Rate-Limit-Interval: 60
X-Rate-Limit-Limit: 2000
X-Rate-Limit-Reset: [timestamp]
```

**Fix:**
- Wait 60 seconds for rate limit to reset
- Check if you have multiple browser tabs open making requests
- Close other tabs testing the same app

---

### 3. **CORS Policy Blocking**

Per [Mapbox HTTPS and CORS docs](https://docs.mapbox.com/api/guides/#https-and-cors):

> Mapbox web services support Cross-Origin Requests with no domain restrictions.

But browsers can still block for security reasons.

**Check Console for:**
```
Access to XMLHttpRequest at 'https://api.mapbox.com/...' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Fix:**
1. ✅ Requests automatically upgrade from HTTP to HTTPS
2. ✅ Next.js headers configured (already done in `next.config.ts`)
3. ⚠️ Check browser extensions (disable ad blockers, privacy tools)
4. ⚠️ Try incognito/private mode

---

### 4. **Browser Extensions Blocking**

Common culprits:
- 🛡️ Privacy Badger
- 🚫 uBlock Origin
- 🔒 HTTPS Everywhere
- 🍪 Cookie blockers

**Fix:**
1. Open DevTools → Network tab
2. Look for requests with status `(blocked:other)`
3. Temporarily disable extensions
4. Refresh page

---

### 5. **Firewall or Network Policy**

Your network might block:
- External API calls
- Specific domains (api.mapbox.com)
- WebGL content

**Check:**
```bash
# Test if you can reach Mapbox API
curl -I https://api.mapbox.com/styles/v1/mapbox/dark-v11

# Should return: HTTP/2 200
```

**Fix:**
- Try on different network (mobile hotspot)
- Check corporate firewall settings
- Contact IT department

---

### 6. **Environment Variable Not Loading**

Next.js requires `NEXT_PUBLIC_` prefix for client-side env vars.

**Common Mistakes:**
```env
# ❌ Wrong - missing NEXT_PUBLIC_
MAPBOX_ACCESS_TOKEN=pk.xxx

# ✅ Correct
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.xxx
```

**Verify:**
```typescript
// Add this temporarily in your component
console.log('ENV:', process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)
```

**Fix:**
1. Ensure file is named `.env.local` (not `.env`)
2. File must be in project root
3. Restart dev server after changing .env files
4. Check for typos in variable name

---

## 🔧 Step-by-Step Debugging Process

### Step 1: Check Browser Console

Open DevTools (`F12`) and look for:

```javascript
🔑 Mapbox Token Status: {
  fromEnv: true,
  tokenPrefix: 'pk.eyJ1IjoiYWxkaS0yMyI...',
  tokenLength: 171,
  isValid: true
}

🗺️ Creating Mapbox instance...
📦 Map instance created, waiting for load...
```

**If you see:**
- ❌ `fromEnv: false` → Environment variable not loading
- ❌ `isValid: false` → Token doesn't start with `pk.`
- ❌ `tokenLength: 0` → Token is empty

---

### Step 2: Check Network Tab

1. Open DevTools → **Network** tab
2. Filter by "mapbox"
3. Refresh page

**Look for:**

| Status | Meaning | Fix |
|--------|---------|-----|
| `200 OK` | ✅ Working! | None needed |
| `401 Unauthorized` | ❌ Invalid token | Check .env.local |
| `403 Forbidden` | ❌ Wrong scopes | Token needs proper scopes |
| `404 Not Found` | ❌ Wrong style URL | Check NEXT_PUBLIC_MAPBOX_STYLE |
| `429 Too Many` | ⚠️ Rate limited | Wait 60 seconds |
| `(canceled)` | ⚠️ Request aborted | Component unmounting (fixed) |
| `(blocked)` | ❌ CORS/Extension | Check extensions/CORS |

---

### Step 3: Test Token Directly

```bash
# Replace with your actual token
curl "https://api.mapbox.com/styles/v1/mapbox/dark-v11?access_token=pk.eyJ1IjoiYWxkaS0yMyIsImEiOiJjbWhyZWJwZDMwd2k3MmtzNDRlMjJpeWVnIn0.Pi2JqSiMdQs5SrT70vhI-g"
```

**Expected:** JSON response with style data
**If fails:** Token is invalid or expired

---

### Step 4: Check Mapbox Account

1. Visit: https://account.mapbox.com/
2. Check **Tokens** page
3. Verify:
   - ✅ Token exists
   - ✅ Token is not restricted to specific URLs
   - ✅ Token has public scopes
   - ✅ Account is active (not over quota)

---

### Step 5: Check Rate Limits

In Network tab, look at response headers:

```
X-Rate-Limit-Interval: 60
X-Rate-Limit-Limit: 2000
X-Rate-Limit-Reset: 1704153600
```

**Calculate if you're near limit:**
- Styles API: 2,000/min
- Your app loads: ~10 requests on initial load
- Safe: < 1,900/min

---

## 🛠️ Quick Fixes

### Fix 1: Restart Everything

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Clear Next.js cache
rm -rf .next

# 3. Restart
npm run dev
```

### Fix 2: Hard Browser Refresh

```
Chrome/Edge: Cmd/Ctrl + Shift + R
Safari: Cmd + Option + R
Firefox: Cmd/Ctrl + Shift + R
```

### Fix 3: Test in Incognito

```
Chrome: Cmd/Ctrl + Shift + N
Safari: Cmd + Shift + N
Firefox: Cmd/Ctrl + Shift + P
```

This eliminates:
- Extension interference
- Cached data issues
- Cookie problems

### Fix 4: Alternative Style

If `dark-v11` is blocked, try another:

```env
# In .env.local
NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12
```

### Fix 5: Use HTTP (Temporary Test Only)

```typescript
// TEMPORARY - for testing only
const testUrl = 'https://api.mapbox.com/styles/v1/mapbox/dark-v11?access_token=' + MAPBOX_TOKEN
fetch(testUrl)
  .then(r => r.json())
  .then(data => console.log('✅ Direct fetch works:', data))
  .catch(e => console.error('❌ Direct fetch failed:', e))
```

---

## 📊 What You Should See (Success)

### Console Output:
```
🔑 Mapbox Token Status: {fromEnv: true, tokenPrefix: 'pk.eyJ...', tokenLength: 171, isValid: true}
Initializing Mapbox with token: pk.eyJ...
🗺️ Creating Mapbox instance...
📦 Map instance created, waiting for load...
🎨 Map style loaded
✅ Map loaded successfully!
📍 Center: [-122.4194, 37.7749]
🎯 Zoom: 12
🛣️ Initializing routes...
💤 Map idle (fully loaded)
```

### Network Tab:
```
GET https://api.mapbox.com/styles/v1/mapbox/dark-v11?...
Status: 200 OK
Type: xhr
Size: 35.2 KB

GET https://api.mapbox.com/v4/mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2/...
Status: 200 OK
Type: xhr
Size: 156 KB
```

---

## 🆘 Still Not Working?

### Check These:

1. **Token URL Restrictions**
   - Go to: https://account.mapbox.com/access-tokens/
   - Click your token
   - Ensure "URL restrictions" is empty or includes `localhost:3000`

2. **Token Scopes**
   - Default public token should work
   - If you created a custom token, ensure it has:
     - ✅ `styles:read`
     - ✅ `styles:tiles`
     - ✅ `fonts:read`

3. **Mapbox Service Status**
   - Check: https://status.mapbox.com/
   - Look for any outages

4. **Browser Console Errors**
   Take a screenshot and look for:
   - `WebGL` errors → Graphics driver issue
   - `SecurityError` → CORS/Mixed content
   - `NetworkError` → Firewall/DNS issue

---

## 📧 Getting Help

If still blocked, provide:

1. **Console output** (full 🔑 Token Status log)
2. **Network tab screenshot** (showing blocked request)
3. **Browser version**
4. **Operating system**
5. **Are you on corporate/school network?**

---

## 🎯 Expected Outcome

After fixing, you should see:
- ✅ Dark map tiles loading
- ✅ Blue route line (#00597C)
- ✅ Aqua ghost paths (#55DDCA)
- ✅ "🔒 HTTPS Secure" badge
- ✅ No errors in console

The map loads in **1-2 seconds** on decent connection!

---

## 📚 Official Documentation References

- [Mapbox API Overview](https://docs.mapbox.com/api/guides/)
- [Access Tokens](https://docs.mapbox.com/api/guides/#access-tokens-and-token-scopes)
- [Rate Limits](https://docs.mapbox.com/api/guides/#rate-limits)
- [HTTPS & CORS](https://docs.mapbox.com/api/guides/#https-and-cors)
- [Styles API](https://docs.mapbox.com/api/maps/styles/)

---

**Last Updated:** Following Mapbox API v1 specifications
