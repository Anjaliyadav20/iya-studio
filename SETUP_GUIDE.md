# IYA Studio - MySQL Setup Guide

This guide explains how to set up the complete application with MySQL backend replacing Supabase.

## Project Structure

```
aura-ink-studio-main/
├── src/                    # Frontend React application (JSX)
│   ├── pages/             # Page components (Auth, Admin, Contact, etc.)
│   ├── components/        # UI components and admin tabs
│   ├── services/
│   │   └── api.js         # API client for backend communication
│   └── ...
├── backend/               # Express.js backend server
│   ├── config/
│   │   └── database.js    # MySQL connection pool
│   ├── middleware/
│   │   └── auth.js        # JWT authentication utilities
│   ├── routes/            # API endpoint handlers
│   ├── database/
│   │   └── schema.sql     # MySQL database schema
│   ├── server.js          # Express server
│   ├── package.json
│   └── .env               # Environment variables
└── ...
```

## Prerequisites

- Node.js 14+ and npm
- MySQL 5.7+ or 8.0+
- Git

## Backend Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- `express` - Web framework
- `mysql2` - MySQL client with connection pooling
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `express-validator` - Request validation
- `nodemon` - Development auto-reload (dev)

### 2. Create MySQL Database

Run the following SQL script to create the database and tables:

```bash
mysql -u root -p < backend/database/schema.sql
```

**What this script creates:**
- `iya_studio` database
- `users` table - Admin user accounts with bcrypt password hashing
- `bookings` table - Customer booking requests with status tracking
- `gallery` table - Gallery items (images/videos) with service type filtering
- `services` table - Available services with active status toggle
- Proper indexes and constraints

### 3. Configure Environment Variables

Copy the example env file and update credentials:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=iya_studio

# Server Configuration
PORT=5000

# JWT Configuration
JWT_SECRET=your_very_secure_random_string_here
JWT_EXPIRATION=7d
```

**Important:**
- Change `MYSQL_PASSWORD` to your MySQL root password
- Change `JWT_SECRET` to a strong random string (e.g., use `openssl rand -base64 32`)
- Keep `MYSQL_DATABASE` as `iya_studio` (created by schema.sql)

### 4. Start Backend Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

You should see:
```
Server running on port 5000
MySQL connected successfully
```

## Frontend Setup

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Configure API Endpoint

Create or update `src/vite.config.ts` - ensure it has frontend running on port 5173:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
  }
})
```

The API client automatically points to `http://localhost:5000` (defined in `src/services/api.js`)

### 3. Start Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Running Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new admin account
- `POST /auth/signin` - Login with email/password
- `GET /auth/me` - Get current user info (requires JWT token)
- `GET /auth/check-admin` - Check if user is admin

### Bookings
- `GET /bookings` - Get all bookings (admin only)
- `POST /bookings` - Create new booking
- `PUT /bookings/:id` - Update booking status (admin only)

### Gallery
- `GET /gallery` - Get all gallery items
- `POST /gallery` - Add gallery item (admin only)
- `DELETE /gallery/:id` - Delete gallery item (admin only)

### Services
- `GET /services` - Get all services
- `PUT /services/:id` - Update service details (admin only)
- `PATCH /services/:id/toggle` - Toggle service active status (admin only)

## Frontend Pages

### Public Pages
- `/` - Home page with hero section, services, gallery
- `/services` - Services listing
- `/gallery` - Gallery view
- `/contact` - Booking form
- `/auth` - Admin login/signup

### Admin Pages (Requires Authentication)
- `/admin` - Admin dashboard with three tabs:
  - **Bookings** - Manage customer booking requests
  - **Gallery** - Add/remove gallery items
  - **Services** - Edit service details and toggle active status

## Authentication Flow

### User Registration
1. User clicks "Create Account" on Auth page
2. Enters email and password
3. Frontend calls `apiClient.signup(email, password)`
4. Backend hashes password with bcryptjs
5. Creates user in database
6. Returns JWT token
7. Token stored in localStorage
8. Redirected to `/admin` (requires admin approval)

### User Login
1. User enters email and password
2. Frontend calls `apiClient.signin(email, password)`
3. Backend verifies credentials with bcryptjs
4. Returns JWT token if valid
5. Token stored in localStorage
6. Redirected to `/admin`

### Admin Authorization
1. Admin page loads
2. Calls `apiClient.getCurrentUser()` to verify token
3. Calls `apiClient.checkAdmin()` to verify admin status
4. Shows "Access Denied" if not admin
5. Database admin must manually set `is_admin=1` for new users

## Making a User an Admin

Connect to MySQL and run:

```sql
UPDATE users SET is_admin = 1 WHERE email = 'user@example.com';
```

## Testing the Application

### 1. Create Admin Account
- Go to `http://localhost:5173/auth`
- Click "Create Account"
- Enter email and password
- Make that user admin via SQL

### 2. Test Admin Dashboard
- Login with admin account
- Navigate to `/admin`
- Test each tab:
  - **Bookings** - View and update booking status
  - **Gallery** - Add/delete gallery items
  - **Services** - Edit service details

### 3. Test Booking Form
- Go to `http://localhost:5173/contact`
- Fill out booking form
- Submit
- Check bookings in admin dashboard

## Troubleshooting

### Backend won't start
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
- Check MySQL is running: `mysql -u root -p`
- Verify MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD in `.env`

### Login fails
```
Unauthorized: Invalid credentials
```
- Verify user exists: `SELECT * FROM users WHERE email = 'test@example.com';`
- Check password was hashed: `Password starts with $2a$ or $2b$`

### Frontend can't reach backend
```
CORS error or failed to fetch
```
- Verify backend is running on port 5000
- Check API_BASE_URL in `src/services/api.js` is `http://localhost:5000`
- Check browser console for actual error

### JWT token expired
- Token expires in 7 days (configurable in `.env`)
- User must login again
- Token stored in localStorage as `auth_token`

## Database Backup

### Backup
```bash
mysqldump -u root -p iya_studio > backup.sql
```

### Restore
```bash
mysql -u root -p iya_studio < backup.sql
```

## Production Deployment

For production deployment:

1. **Backend:**
   - Use environment variables (not hardcoded)
   - Enable HTTPS
   - Set strong JWT_SECRET
   - Use database user with limited permissions
   - Enable database backups

2. **Frontend:**
   - Update API_BASE_URL to production backend
   - Build: `npm run build`
   - Deploy `dist/` folder

3. **Database:**
   - Use managed MySQL (AWS RDS, Google Cloud SQL, etc.)
   - Enable SSL connections
   - Set up automated backups
   - Use strong passwords

4. **Security:**
   - Set CORS origin to production domain only
   - Use HTTPS everywhere
   - Implement rate limiting
   - Add request validation
   - Keep dependencies updated

## Support

For issues, check:
1. Terminal output for error messages
2. Browser console (F12) for frontend errors
3. MySQL logs
4. Verify all environment variables are set correctly
