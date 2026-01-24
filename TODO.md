# Authentication System Fix - TODO List

## Issues to Fix:

### 1. Fix register function in userController.js

- [ ] Add missing closing `}` for the register function
- [ ] Test that user registration works correctly

### 2. Complete login function in userController.js

- [ ] Add user existence validation
- [ ] Add password comparison using bcrypt.compare()
- [ ] Generate JWT token using jsonwebtoken
- [ ] Set authentication cookie
- [ ] Send proper success/error response

## Status: IN PROGRESS

## Dependencies Available:

- bcrypt (for password comparison)
- jsonwebtoken (for token generation)
- cookie-parser (already configured in app.js)

## Next Steps:

1. Fix userController.js file
2. Test authentication endpoints
