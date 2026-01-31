# 🎨 IYA Studio - Admin Access & Data Guide

## 🔐 ADMIN CREDENTIALS

```
Email: admin@iya.art
Password: Admin123!@#
```

> **⚠️ IMPORTANT:** Change these credentials immediately after first login!

---

## 📊 QUICK ACCESS GUIDE

### Where to Find Your Data:

| Data Type | Location | Access URL |
|-----------|----------|-----------|
| **Form Submissions** | Admin → Bookings Tab | http://localhost:8081/admin |
| **Portfolio Images** | Admin → Gallery Tab | http://localhost:8081/admin |
| **Services & Pricing** | Admin → Services Tab | http://localhost:8081/admin |
| **API Backend** | REST API | http://localhost:3001/api |

---

## 🚀 QUICK START (First Time Setup)

### Step 1: Setup Database
Run one of these commands based on your OS:

**Windows (Batch file):**
```bash
setup-db.bat
```

**Mac/Linux (Bash script):**
```bash
bash setup-db.sh
```

**Manual (MySQL command line):**
```bash
mysql -h localhost -u root < backend/database/schema.sql
```

### Step 2: Start Backend Server
```bash
cd backend
npm run dev
```
✓ Backend runs on `http://localhost:3001`

### Step 3: Start Frontend Server
```bash
npm run dev
```
✓ Frontend runs on `http://localhost:8081`

### Step 4: Register First Admin User
Visit: `http://localhost:8081/auth`
- Click "Sign Up"
- Email: `admin@iya.art`
- Password: `Admin123!@#`
- Create account

### Step 5: Access Admin Dashboard
Visit: `http://localhost:8081/admin`
- Login with your credentials
- You're in! 🎉

---

## 📋 DATA STORAGE LOCATIONS

### 1. Customer Booking Submissions
**Where:** Admin Dashboard → **Bookings Tab**
**What's Stored:**
- Customer name, email, phone
- Event location
- Preferred date & time
- Service selected
- Event details
- Booking status (Pending/Confirmed/Completed/Cancelled)

**Database Table:** `bookings`

**Quick Stats You Can Track:**
- Total bookings received
- Pending vs. confirmed bookings
- Service popularity
- Revenue potential

---

### 2. Portfolio & Gallery
**Where:** Admin Dashboard → **Gallery Tab**
**What You Can Do:**
- Add/Edit/Delete portfolio images
- Add video links
- Tag images by service type
- Mark favorites as featured
- Organize your portfolio

**Database Table:** `gallery`

---

### 3. Services & Pricing
**Where:** Admin Dashboard → **Services Tab**
**What You Can Manage:**
- Service names & descriptions
- Price ranges
- Service availability (Active/Inactive)
- Edit details anytime

**Database Table:** `services`

---

## 🗄️ DATABASE DETAILS

### Connection Info:
```
Host: localhost
Database: iya_studio
User: root
Password: (leave empty for default/local setup)
Port: 3306
```

### Database Tables:
1. **users** - Admin accounts & authentication
2. **bookings** - Customer booking requests
3. **gallery** - Portfolio images/videos
4. **services** - Service catalog & pricing

### View Data Directly (MySQL):
```sql
-- All customer bookings
SELECT * FROM bookings;

-- All gallery items
SELECT * FROM gallery;

-- All services
SELECT * FROM services;

-- All users/admins
SELECT * FROM users;
```

---

## 📱 FORM SUBMISSION FLOW

### How Customer Data Reaches Admin:

1. **Customer fills Contact Form** → `http://localhost:8081/contact`
2. **Form submits to** → `http://localhost:3001/api/bookings`
3. **Data saved to** → MySQL `bookings` table
4. **You see it in** → Admin Dashboard → Bookings Tab

### What Info is Captured:
- ✅ Full name
- ✅ Email address
- ✅ Phone number
- ✅ Event location
- ✅ Service type
- ✅ Preferred date & time
- ✅ Event details/notes
- ✅ Submission date/time

---

## 🔌 API ENDPOINTS (For Developers)

### Authentication:
```
POST   /api/auth/register    - Create new account
POST   /api/auth/login       - Login & get token
GET    /api/auth/me          - Get current user
POST   /api/auth/logout      - Logout
```

### Bookings:
```
GET    /api/bookings         - Get all bookings
POST   /api/bookings         - Create booking
PUT    /api/bookings/:id     - Update booking status
DELETE /api/bookings/:id     - Delete booking
```

### Gallery:
```
GET    /api/gallery          - Get all items
POST   /api/gallery          - Add new item
DELETE /api/gallery/:id      - Delete item
```

### Services:
```
GET    /api/services         - Get all services
PUT    /api/services/:id     - Update service
```

---

## 👥 CREATE ADDITIONAL ADMIN USERS

### Via Admin Dashboard:
1. Register new user account at `/auth`
2. Contact system admin to set `is_admin = TRUE`

### Via Database (Advanced):
```sql
UPDATE users SET is_admin = TRUE WHERE email = 'user@example.com';
```

---

## 🔧 MANAGE YOUR ADMIN ACCOUNT

### Change Password:
1. Go to Admin Dashboard
2. Look for settings/profile option
3. Update password

### Reset Password (If Forgotten):
```sql
-- Set password hash manually (requires bcryptjs hashing)
UPDATE users SET password = '[hashed_password]' WHERE email = 'admin@iya.art';
```

---

## 📈 BUSINESS METRICS YOU CAN TRACK

### In Admin Dashboard, Monitor:
- 📅 **Total Bookings** - How many customers requested services
- 💰 **Service Popularity** - Which services are most requested
- 📅 **Booking Dates** - Peak booking times
- 📍 **Locations** - Where your customers are from
- 👥 **Customer Details** - Email, phone for follow-up

---

## 🆘 TROUBLESHOOTING

### ❌ Can't login to Admin?
- Double-check email: `admin@iya.art`
- Double-check password: `Admin123!@#`
- Clear browser cache (Ctrl+Shift+Del)
- Try incognito/private browser window

### ❌ Admin page says "Access Denied"?
- User account is not marked as admin
- Update database: `UPDATE users SET is_admin = TRUE WHERE email = 'admin@iya.art';`

### ❌ Backend connection error?
- Check if backend is running: `http://localhost:3001/health`
- Verify backend on port 3001
- Check `.env` file in backend folder

### ❌ Database not found?
- Run setup script: `setup-db.bat` (Windows)
- Verify MySQL is running
- Check database name: `iya_studio`

### ❌ Can't see form submissions?
- Submit test booking first at `/contact`
- Refresh admin page
- Check if booking appears in Bookings Tab

---

## 💾 BACKUP YOUR DATA

### Backup Database:
```bash
# Windows
mysqldump -h localhost -u root iya_studio > backup.sql

# Mac/Linux
mysqldump -h localhost -u root iya_studio > backup.sql
```

### Restore Database:
```bash
mysql -h localhost -u root iya_studio < backup.sql
```

---

## 🎯 ADMIN DASHBOARD FEATURES

### Bookings Tab:
- 📋 View all customer bookings
- ✏️ Update booking status
- 🗑️ Delete bookings
- 🔍 Filter by status/date

### Gallery Tab:
- 📸 Add portfolio images
- 🎥 Add video links
- 🏷️ Tag by service type
- ⭐ Mark as featured
- 🗑️ Delete items

### Services Tab:
- 📝 Edit service names
- 💵 Update pricing
- ✅ Toggle service active/inactive
- 📄 Edit descriptions

---

## 📞 NEXT STEPS

1. ✅ Setup database (run `setup-db.bat`)
2. ✅ Start backend (`npm run dev` in `/backend`)
3. ✅ Start frontend (`npm run dev` in root)
4. ✅ Create admin account at `/auth`
5. ✅ Login to admin dashboard at `/admin`
6. ✅ Upload portfolio images
7. ✅ Add your services & pricing
8. ✅ Start taking bookings! 🎉

---

**Last Updated:** January 30, 2026
**Version:** 1.0
**Status:** Production Ready ✅

