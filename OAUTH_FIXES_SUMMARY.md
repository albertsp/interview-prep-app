# OAuth Authentication Fixes Summary

## Issues Fixed

### 1. Critical: auth.py login crash for OAuth-only users
**File**: `backend/app/routes/auth.py:65`
**Problem**: The `bcrypt.checkpw()` function crashes when `user.password` is `None` (OAuth-only users).
**Fix**: Added a guard to check if `user.password is None` before attempting to verify the password.

### 2. High: GitHub empty email unique constraint violation
**File**: `backend/app/routes/oauth.py:118-119`
**Problem**: GitHub users without public email get `email=""`, which violates the unique constraint on the `email` field when multiple OAuth-only users have no email.
**Fix**: Generate a unique email from the GitHub user ID when no email is available: `f"github_{github_id}@users.noreply.github.com"`

### 3. Medium: Google empty email unique constraint violation
**File**: `backend/app/routes/oauth.py:78-79`
**Problem**: Google users without email get `email=""`, which violates the unique constraint.
**Fix**: Generate a unique email from the Google user ID when no email is available: `f"google_{google_id}@users.noreply.google.com"`

### 4. Medium: Improved error handling for OAuth callbacks
**File**: `backend/app/routes/oauth.py:65-127`
**Problem**: OAuth callbacks had minimal error handling, which could result in 500 errors instead of proper redirects.
**Fix**: Added comprehensive error handling to catch exceptions and redirect to the login page with `error=oauth_failed`.

### 5. Critical: CORS and FRONTEND_URL configuration
**File**: `backend/fly.toml` and Fly.io secrets
**Problem**: CORS_ORIGINS and FRONTEND_URL were set to `http://localhost:3000` in production, preventing the production frontend from making API calls.
**Fix**: Updated Fly.io secrets to use the production frontend URL: `https://interviewkit.dev`

## Files Modified

1. `backend/app/routes/auth.py` - Fixed login crash for OAuth users
2. `backend/app/routes/oauth.py` - Fixed email handling and improved error handling
3. `backend/fly.toml` - Added builder configuration

## What Needs to Be Done

### 1. Deploy Backend to Fly.io
Since I cannot deploy directly from this environment, you need to:
- Run `fly deploy --app interview-prep-api` from the `backend` directory
- The fly.toml file is already configured correctly with the builder

### 2. Update Google and GitHub OAuth App Settings
Ensure the Google and GitHub OAuth apps have the correct redirect URIs:
- Google: `https://interview-prep-api.fly.dev/auth/google/callback`
- GitHub: `https://interview-prep-api.fly.dev/auth/github/callback`

### 3. Test Production OAuth Flow
After deployment, test the OAuth flow:
1. Access the production frontend: `https://interviewkit.dev`
2. Click Google or GitHub login button
3. Complete OAuth flow
4. Verify successful login and redirect to `/session`

## Verification Steps

### 1. Check CORS Headers
```bash
curl -I https://interview-prep-api.fly.dev/auth/login -H "Origin: https://interviewkit.dev"
```
Expected: `Access-Control-Allow-Origin: https://interviewkit.dev`

### 2. Test OAuth Endpoints
```bash
curl -I https://interview-prep-api.fly.dev/auth/google
curl -I https://interview-prep-api.fly.dev/auth/github
```
Expected: Both should return 302 redirect to respective OAuth providers

### 3. Test API Access
```bash
curl -H "Origin: https://interviewkit.dev" https://interview-prep-api.fly.dev/me/profile
```
Expected: Should return 401 (Unauthorized) or 200 if authenticated

## Notes

1. The `.env` file in the backend contains real OAuth secrets. These should be moved to Fly.io secrets in production.
2. The `FRONTEND_URL` and `CORS_ORIGINS` Fly.io secrets have been updated to `https://interviewkit.dev`.
3. The OAuth flow should now work correctly in production.
