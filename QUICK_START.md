# 🚀 Quick Reference Guide

## Start the Application

### Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev
```

### Frontend (Terminal 2)
```bash
npm install
npm run dev
```

### Open Browser
```
http://localhost:5173
```

---

## First Time Setup

```bash
# 1. Initialize Database
mysql -u root -p < backend/database/schema.sql

# 2. Setup Backend
cd backend
cp .env.example .env
# Edit .env and update MYSQL_PASSWORD
npm install

# 3. Setup Frontend
npm install
```

---

## Admin Access

```bash
# Make first user admin
mysql -u root -p iya_studio
UPDATE users SET is_admin = 1 WHERE email = 'your@email.com';
EXIT;
```

---

## Key URLs

| Purpose | URL |
|---------|-----|
| Home | `http://localhost:5173` |
| Services | `http://localhost:5173/services` |
| Gallery | `http://localhost:5173/gallery` |
| Booking | `http://localhost:5173/contact` |
| Login | `http://localhost:5173/auth` |
| Admin Dashboard | `http://localhost:5173/admin` |

---

## API Base URL

**Frontend:** `http://localhost:5000`  
**Backend Port:** 5000  
**Frontend Port:** 5173

---

## Common Commands

### Database

```bash
# Backup
mysqldump -u root -p iya_studio > backup.sql

# Restore
mysql -u root -p iya_studio < backup.sql

# View users
mysql -u root -p iya_studio -e "SELECT * FROM users;"

# Reset database
mysql -u root -p < backend/database/schema.sql
```

### Backend

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
node server.js

# Install dependencies
npm install
```

### Frontend

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

---

## Environment Variables

### Backend (.env)
```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=change_me
MYSQL_DATABASE=iya_studio
PORT=5000
JWT_SECRET=your_secure_random_string
JWT_EXPIRATION=7d
```

### Frontend
No setup needed - uses localhost API

---

## API Methods

### Authentication
```javascript
apiClient.signup(email, password)
apiClient.signin(email, password)
apiClient.getCurrentUser()
apiClient.checkAdmin()
apiClient.logout()
```

### Bookings
```javascript
apiClient.getBookings()
apiClient.createBooking(data)
apiClient.updateBookingStatus(id, status)
```

### Gallery
```javascript
apiClient.getGallery()
apiClient.addGalleryItem(data)
apiClient.deleteGalleryItem(id)
```

### Services
```javascript
apiClient.getServices()
apiClient.updateService(id, data)
apiClient.toggleServiceActive(id)
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| MySQL not found | Install MySQL and add to PATH |
| Port 5000 in use | Change `PORT` in backend .env |
| Port 5173 in use | Add `--port 5174` to `npm run dev` |
| Database not created | Run `mysql -u root -p < backend/database/schema.sql` |
| Login fails | Check email/password, verify user in database |
| CORS error | Ensure backend is running on port 5000 |
| Token expired | Login again (tokens expire in 7 days) |

---

## File Locations

| File | Purpose |
|------|---------|
| `backend/.env` | Backend configuration |
| `backend/server.js` | Express server entry |
| `backend/database/schema.sql` | Database schema |
| `src/services/api.js` | API client |
| `src/pages/Auth.jsx` | Login/Signup page |
| `src/pages/Admin.jsx` | Admin dashboard |

---

## Features

✅ Bookings management  
✅ Gallery management  
✅ Services management  
✅ Admin authentication  
✅ JWT tokens  
✅ MySQL database  
✅ Bcryptjs password hashing  
✅ CORS enabled  
✅ Error handling  
✅ Connection pooling  

---

## Documentation

- **SETUP_GUIDE.md** - Full setup instructions
- **MIGRATION_NOTES.md** - Migration details
- **MIGRATION_COMPLETE.md** - Checklist & differences
- **README.md** - Project overview

---

## Need Help?

1. Check **SETUP_GUIDE.md** for detailed instructions
2. Check terminal output for error messages
3. Check browser console (F12) for frontend errors
4. Verify `.env` variables are correct
5. Ensure MySQL is running: `mysql -u root -p`

---

**Ready to start? Run these commands:**

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (in new terminal)
npm install && npm run dev

# Then open http://localhost:5173
```

🎉 That's it!
