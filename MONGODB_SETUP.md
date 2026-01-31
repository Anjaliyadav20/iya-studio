# MongoDB Setup Guide

## Overview
Your IYA Studio backend has been migrated from MySQL to MongoDB. This guide provides setup and verification instructions.

## Prerequisites
- MongoDB Community Server (https://www.mongodb.com/try/download/community)
- Node.js 16+ 
- npm or yarn

## Installation Steps

### 1. Download and Install MongoDB

#### Windows
1. Visit https://www.mongodb.com/try/download/community
2. Select **Windows** and download the MSI installer
3. Run the installer and follow the setup wizard
4. Choose "Install MongoDB as a Service" during installation
5. MongoDB will auto-start on port 27017

#### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2. Verify MongoDB Installation

Check if MongoDB is running:
```bash
mongo --version
mongosh --version
```

Connect to MongoDB shell:
```bash
mongosh
```

You should see a connection to `mongodb://localhost:27017/`

### 3. Create Database and Collections

In MongoDB shell, run:
```javascript
use iya_studio

db.users.createIndex({ email: 1 }, { unique: true })

db.bookings.insertMany([])

db.galleries.insertMany([])

db.services.insertMany([])

show collections
```

### 4. Verify Backend Connection

Restart the backend server:
```bash
cd backend
npm start
```

You should see:
```
✓ MongoDB connected successfully
🚀 Server running on http://localhost:3001
```

## Default Admin User

The first time, create an admin account via `/api/auth/signup`:

**POST** `http://localhost:3001/api/auth/signup`
```json
{
  "email": "admin@iya.art",
  "password": "Admin123!@#"
}
```

## Backup and Restore

### Backup Database
```bash
mongodump --db iya_studio --out ./backup
```

### Restore Database
```bash
mongorestore --db iya_studio ./backup/iya_studio
```

## Common Issues

**Issue**: Cannot connect to MongoDB
- **Solution**: Ensure MongoDB service is running
  ```bash
  # Windows
  net start MongoDB
  
  # macOS
  brew services start mongodb-community
  
  # Linux
  sudo systemctl start mongodb
  ```

**Issue**: Port 27017 already in use
- **Solution**: Stop other MongoDB instances or change MONGODB_URI in `.env`

**Issue**: Permission denied on data files
- **Solution**: Check MongoDB data directory permissions (usually `/data/db` or `/var/lib/mongodb`)

## Troubleshooting

### Check MongoDB Status
```bash
# Windows - Check service
Get-Service MongoDB

# macOS - Check service
brew services list | grep mongodb

# Linux - Check service
sudo systemctl status mongodb
```

### View MongoDB Logs
```bash
# Default log location
# Windows: C:\Program Files\MongoDB\Server\*\log\mongod.log
# macOS: /usr/local/var/log/mongodb/mongo.log
# Linux: /var/log/mongodb/mongod.log
```

### Reset MongoDB
```bash
# Clear all data (WARNING: This deletes all data!)
db.dropDatabase()
```

## Environment Variables

Make sure your `.env` file in `/backend` contains:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/iya_studio
JWT_SECRET=your_jwt_secret_key_here
```

## API Endpoints (Still the same!)

All API endpoints remain unchanged:
- `POST /api/auth/signup` - Register new admin
- `POST /api/auth/signin` - Login admin
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id` - Update booking status
- `GET /api/gallery` - Get gallery items
- `POST /api/gallery` - Add gallery item
- `DELETE /api/gallery/:id` - Delete gallery item
- `GET /api/services` - Get all services
- `PATCH /api/services/:id` - Update service
- `PATCH /api/services/:id/toggle` - Toggle service active status

## Next Steps

1. Install MongoDB on your system
2. Start MongoDB service
3. Run `npm start` in the backend folder
4. Test API endpoints with Postman or curl
5. Frontend will work seamlessly with the new MongoDB backend

---

**Note**: All previous MySQL data must be manually migrated to MongoDB if needed. For a fresh start, the database will be created automatically on first connection.
