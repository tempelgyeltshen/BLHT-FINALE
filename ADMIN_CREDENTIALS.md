# Admin Credentials Setup

## Default Admin Credentials

**Email:** `tempelgyeltshen12345@gmail.com`  
**Password:** `blht_admin_2026`

## Render Environment Variables

Add these to your Render backend service environment variables:

```
ADMIN_EMAIL=tempelgyeltshen12345@gmail.com
ADMIN_PASSWORD_HASH=$2a$10$ZSYu2X/7aETdV22E7oCm1.H3baXPpSO7Wx41WR0WcmIwbxMzJ0Wvy
```

## Generate Custom Admin Credentials

If you want to use different credentials, run the script:

```bash
cd backend
node ../scripts/generate-admin-hash.js your-email@domain.com your-password
```

Example:
```bash
cd backend
node ../scripts/generate-admin-hash.js admin@yourdomain.com MySecurePassword123
```

## Important Security Notes

1. **Change the default password** after first login if you use the default credentials
2. **Never commit actual credentials** to Git
3. **Use strong passwords** with at least 12 characters
4. **Enable 2FA** on your email account for additional security
5. **Regularly rotate** admin passwords

## How to Login

1. Go to your deployed frontend
2. Navigate to the admin section
3. Enter the admin email and password
4. You'll have full access to the CMS and admin features

## Testing Locally

For local development, you can set these in your `.env` file:

```bash
ADMIN_EMAIL=tempelgyeltshen12345@gmail.com
ADMIN_PASSWORD_HASH=$2a$10$ZSYu2X/7aETdV22E7oCm1.H3baXPpSO7Wx41WR0WcmIwbxMzJ0Wvy
```

## Troubleshooting

If you can't login:
1. Check that the environment variables are set correctly in Render
2. Ensure the password hash matches exactly (no extra spaces)
3. Verify the email is spelled correctly
4. Check the backend logs for authentication errors