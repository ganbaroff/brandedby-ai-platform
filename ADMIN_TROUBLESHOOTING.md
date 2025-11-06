# Admin Authentication Troubleshooting Guide

## Issue: Login Not Working

### Symptoms
- Admin login form appears but doesn't authenticate
- No error messages or console logs
- Session not being created

### Debugging Steps

#### 1. Test Page Available
Visit: `http://localhost:5173/admin-test`
- Click "Test Login" button
- Check console for detailed logs
- Verify localStorage functionality

#### 2. Console Debugging
Open browser dev tools and run:
```javascript
// Test localStorage
localStorage.setItem('test', 'value');
console.log('localStorage test:', localStorage.getItem('test'));

// Test credentials validation
const validateCredentials = (username, password) => {
  return username === 'admin' && password === 'admin';
};
console.log('Credentials test:', validateCredentials('admin', 'admin'));

// Test session creation manually
const session = {
  loggedIn: true,
  timestamp: new Date().toISOString(),
  user: 'admin',
  expiresAt: new Date(Date.now() + 24*60*60*1000).toISOString()
};
localStorage.setItem('brandedby_admin_session', JSON.stringify(session));
console.log('Manual session created');
```

#### 3. Check Session Storage
In browser dev tools:
1. Go to Application tab
2. Check Local Storage
3. Look for `brandedby_admin_session` key

#### 4. Test Authentication Flow
```javascript
// Check if AdminAuth is available globally
console.log('AdminAuth available:', typeof window.AdminAuth);

// Manual authentication test
if (window.AdminAuth) {
  console.log('Current auth status:', window.AdminAuth.isAuthenticated());
  console.log('Session info:', window.AdminAuth.getSessionInfo());
}
```

### Common Issues & Solutions

#### Issue 1: localStorage Not Available
**Problem**: Running in SSR or secure context issues
**Solution**: Added localStorage availability checks in admin-auth.ts

#### Issue 2: Import Path Issues  
**Problem**: Module resolution errors
**Solution**: Use relative imports `../../shared/admin-auth` instead of `@/shared/admin-auth`

#### Issue 3: Interface Mismatch
**Problem**: AdminLogin expects different callback signature
**Solution**: Simplified interface to `onLogin: () => void`

#### Issue 4: Session Expiration
**Problem**: Session expires immediately
**Solution**: Check system clock, verify expiration logic

### Fixed Implementation

#### Current Login Flow:
1. User enters admin/admin credentials
2. `validateCredentials()` checks against hardcoded values
3. `AdminAuth.createSession()` creates localStorage entry
4. `onLogin()` callback triggers
5. AdminPanel checks `AdminAuth.isAuthenticated()`
6. Session persists for 24 hours

#### Current Files Status:
- ✅ `AdminLogin.tsx` - Simplified callback interface
- ✅ `admin-auth.ts` - Added localStorage checks  
- ✅ `AdminPanel.tsx` - Enhanced debugging logs
- ✅ `AdminAuthTest.tsx` - Test page for debugging

### Testing Credentials
```
Username: admin
Password: admin
```

### Test URLs
- Main site: `http://localhost:5173/`
- Admin panel: `http://localhost:5173/admin-panel`
- Auth test: `http://localhost:5173/admin-test`
- Admin button: Footer of any page

### Expected Behavior
1. Visit `/admin-panel`
2. See loading spinner briefly
3. Redirected to login form
4. Enter admin/admin credentials
5. After 1 second delay, redirected to admin panel
6. See user info in header with logout button
7. Session persists on page refresh

### If Still Not Working
1. Clear browser cache and localStorage
2. Restart development server
3. Check browser console for errors
4. Use test page to verify each component
5. Check network tab for failed requests

### Debug Commands
```bash
# Clear and restart
rm -rf node_modules/.vite
npm run dev

# Check for port conflicts
netstat -ano | findstr :5173
```

### Console Testing Commands
```javascript
// Clear session
localStorage.removeItem('brandedby_admin_session');

// Manual login test
localStorage.setItem('brandedby_admin_session', JSON.stringify({
  loggedIn: true,
  timestamp: new Date().toISOString(),
  user: 'admin',
  expiresAt: new Date(Date.now() + 24*60*60*1000).toISOString()
}));

// Check result
location.reload();
```