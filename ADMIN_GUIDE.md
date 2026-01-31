# IYA Admin Dashboard & Data Guide

## 🔐 Admin Access

### Default Admin Credentials:
```
Email: admin@iya.art
Password: Admin123!@#
```

> **IMPORTANT:** Change these credentials immediately after first login!

---

## 📍 Where to Access Your Data

### 1. **Admin Dashboard**
- **URL:** `http://localhost:8081/admin`
- **Login:** Use credentials above
- **Features:**
  - 📅 **Bookings Tab** - All form submissions from customers
  - 🖼️ **Gallery Tab** - Manage your portfolio images/videos
  - ⚙️ **Services Tab** - Manage your service offerings

---

## 📊 Data Storage & Locations

### **Form Submissions (Bookings)**
- **Where stored:** MySQL Database → `bookings` table
- **What info is collected:**
  - Customer Name
  - Email
  - Phone Number
  - Event Location
  - Service Type (Neon Tattoos, Glitter Art, etc.)
  - Preferred Date & Time
  - Event Details
  - Booking Status (Pending/Confirmed/Completed/Cancelled)

**Access in Admin:** Click `Bookings Tab` → View all submissions → Update status → Delete if needed

---

### **Gallery Images/Videos**
- **Where stored:** MySQL Database → `gallery` table
- **What you manage:**
  - Upload/Delete portfolio images
  - Add video links
  - Categorize by service type
  - Mark as featured

**Access in Admin:** Click `Gallery Tab` → Add/Edit/Delete items

---

### **Services & Pricing**
- **Where stored:** MySQL Database → `services` table
- **What you manage:**
  - Service names & descriptions
  - Price ranges
  - Service availability (Active/Inactive)

**Access in Admin:** Click `Services Tab` → Edit/Toggle services

---

### **User Accounts**
- **Where stored:** MySQL Database → `users` table
- **Admin only users can:**
  - View all registered users
  - Manage permissions
  - View user details

---

## 💾 Backend Database Info

### Database Connection Details:
```
Host: localhost
Database: iya_studio
User: root
Password: (your MySQL password)
Port: 3306
```

### Database Tables:
1. **users** - Admin & staff accounts
2. **bookings** - Customer booking submissions
3. **gallery** - Portfolio items
4. **services** - Service catalog

### Database Creation Script:
Run this in MySQL to create the database:
```sql
source backend/database/schema.sql
```

---

## 🔑 API Endpoints (Backend)

All data is accessed via REST API at `http://localhost:3001/api/`

### Authentication:
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login & get token
- `GET /api/auth/me` - Get current user

### Bookings:
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Gallery:
- `GET /api/gallery` - Get all gallery items
- `POST /api/gallery` - Add new item
- `DELETE /api/gallery/:id` - Delete item

### Services:
- `GET /api/services` - Get all services
- `PUT /api/services/:id` - Update service

---

## 📋 Steps to Access Your Data

### Step 1: Login to Admin
1. Go to `http://localhost:8081/admin`
2. Enter credentials:
   - Email: `admin@iya.art`
   - Password: `Admin123!@#`

### Step 2: View Bookings/Form Submissions
1. Click **"Bookings Tab"** in admin panel
2. View all customer booking requests
3. Update status: Pending → Confirmed → Completed
4. See customer details: Name, Email, Phone, Location, Preferred Date/Time

### Step 3: Manage Gallery
1. Click **"Gallery Tab"**
2. Add new portfolio images
3. Upload images or add video links
4. Organize by service category
5. Mark favorites as featured

### Step 4: Manage Services
1. Click **"Services Tab"**
2. View all service offerings
3. Edit descriptions & pricing
4. Toggle services On/Off
5. Update service details

---

## 🗄️ Direct Database Access (Advanced)

### View Bookings Directly:
```sql
SELECT * FROM bookings;
```

### View Gallery:
```sql
SELECT * FROM gallery;
```

### View Services:
```sql
SELECT * FROM services;
```

### View Users/Admin:
```sql
SELECT * FROM users;
```

---

## 🔧 Create New Admin User

Run this in MySQL to add another admin:
```sql
INSERT INTO users (email, password, is_admin) 
VALUES ('newemail@iya.art', 'hashed_password_here', TRUE);
```

> Note: Password must be hashed using bcryptjs

---

## 📱 Frontend Forms That Submit Data

### 1. **Contact/Booking Form** (`/contact`)
- Submits to: `/api/bookings`
- Visible in Admin Dashboard → Bookings Tab

### 2. **Admin Gallery Upload** 
- Visible in Admin Dashboard → Gallery Tab
- Manage portfolio images

### 3. **Service Management**
- Visible in Admin Dashboard → Services Tab
- Edit your service offerings

---

## ⚠️ Important Notes

1. **First Time Setup:**
   - Create your admin account
   - Update password
   - Add your service categories
   - Upload portfolio images

2. **Backup Your Data:**
   - Regular database backups recommended
   - Export bookings monthly

3. **Security:**
   - Keep login credentials private
   - Change default password immediately
   - Use strong passwords

4. **Backend Status:**
   - Backend running on: `http://localhost:3001`
   - Frontend running on: `http://localhost:8081`
   - Check backend logs if admin doesn't load

---

## 🆘 Troubleshooting

**Admin page won't load?**
- Check if backend is running on port 3001
- Check browser console for errors
- Clear cache and reload

**Can't login?**
- Ensure database is created and running
- Check MySQL connection
- Verify credentials are correct

**Database connection issues?**
- Check `.env` file in backend folder
- Verify MySQL is running
- Check database name: `iya_studio`

---

## 📞 Support

For issues with:
- **Admin access:** Check your email/password
- **Database:** Check MySQL connection
- **API:** Check backend console for errors
- **Frontend:** Check browser developer tools

