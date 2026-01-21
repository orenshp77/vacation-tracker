# Vacation Tagging System

A full-stack web application for managing and following vacation destinations.

## Project Structure

```
project3/
├── backend/                 # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Authentication middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── app.ts          # Application entry point
│   ├── database/           # SQL scripts
│   ├── uploads/            # Uploaded images
│   └── package.json
│
├── frontend/               # React application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service
│   │   ├── utils/          # Helper functions
│   │   └── App.js          # Main application
│   └── package.json
│
└── README.md
```

## Technologies

### Backend
- Node.js
- Express.js
- TypeScript
- MySQL
- JWT Authentication
- bcrypt (password hashing)
- express-fileupload

### Frontend
- React
- React Router DOM
- Axios
- Chart.js / react-chartjs-2
- CSS3

## Prerequisites

- Node.js (v18 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn
- Docker & Docker Compose (optional, for containerized deployment)

## Quick Start with Docker (Recommended)

The easiest way to run the entire application:

```bash
# Build and start all containers
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

The application will be available at:
- **Frontend:** http://localhost
- **Backend API:** http://localhost:4000
- **MySQL:** localhost:3307

To stop the containers:
```bash
docker-compose down
```

To stop and remove all data:
```bash
docker-compose down -v
```

## Manual Installation & Setup

### 1. Clone the repository

```bash
cd project3
```

### 2. Database Setup

1. Open MySQL Workbench or MySQL CLI
2. Run the SQL script located at `backend/database/create_database.sql`

```bash
mysql -u root -p < backend/database/create_database.sql
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Configure environment variables in `.env`:
```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=vacations_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```

Start the backend server:
```bash
npm run dev
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The application will open at `http://localhost:3000`

## Default Users

After running the database script, you can login with:

### Admin User
- Email: `admin@vacations.com`
- Password: `admin123`

### Regular Users
- Email: `john@example.com`
- Password: `user1234`

## Features

### User Features
- Register and Login
- View all vacations with pagination (10 per page)
- Follow/Unfollow vacations
- Filter vacations:
  - My followed vacations
  - Future vacations (not started)
  - Active vacations (ongoing)

### Admin Features
- Add new vacations
- Edit existing vacations
- Delete vacations (with confirmation)
- View followers report (bar chart)
- Download CSV report

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Vacations
- `GET /api/vacations` - Get all vacations
- `GET /api/vacations/:id` - Get vacation by ID
- `POST /api/vacations` - Create vacation (admin)
- `PUT /api/vacations/:id` - Update vacation (admin)
- `DELETE /api/vacations/:id` - Delete vacation (admin)
- `GET /api/vacations/report` - Get followers report (admin)
- `GET /api/vacations/csv` - Download CSV (admin)

### Followers
- `POST /api/followers/:vacationId` - Follow vacation
- `DELETE /api/followers/:vacationId` - Unfollow vacation

## Project Author

**Oren Shpaizer**

## License

This project is created for educational purposes.
