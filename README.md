# Level-2 Assignment-9 Flat Mate Finder Application

This is a Node.js and Express.js application with TypeScript as the programming language, integrating PostgreSQL with Prisma ORM for user data and order management. Ensure data integrity through validation using Zod.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed
- Express.js installed
- Typescript installed
- Prisma installed
- Zod installed

## Features

#### Authentication

- User Registration and Login
- JWT (JSON Web Tokens) is used for secure authentication.

#### CRUD Operations

- Add, update, and view flats in the inventory.
- Robust filtering system for effective flat selection.
- Add, update, and view users and profiles.
- Add, update, and view booking.

## Getting Started

Follow these steps to get your project up and running:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/touhidcodes/Level-2-Assignment-9-Flat-Mate-Finder-App-Server
   ```

2. **Navigate to the project folder:**

```
cd your-repository
```

3. **Install dependencies:**

```
npm install
```

4. **Configure environment variables:**
   Create a .env file in the project root and configure any necessary environment variables. For example:

```
NODE_ENV="development"
PORT=5000
DATABASE_URL="your database url"
ACCESS_TOKEN_SECRET="your access token secret code"
ACCESS_TOKEN_EXPIRES_IN="30d"
REFRESH_TOKEN_SECRET="your refresh token secret code"
REFRESH_TOKEN_EXPIRES_IN="30d"
RESET_PASS_TOKEN="your reset pass token secret code"
RESET_PASS_TOKEN_EXPIRES_IN="5m"
SUPABASE_PASS="your supabase secret code"
SUPER_ADMIN_EMAIL= "super admin email"
SUPER_ADMIN_USERNAME="super admin username"
```

3. **Run the application:**

```
npm run dev
```

Your application should now be running at http://localhost:5000.

## Live URLs

#### Live API URL: https://flat-sharing-app.vercel.app

## API Endpoints:

#### Auth APIs:

- Login: https://flat-sharing-app.vercel.app/api/login
- Register: https://flat-sharing-app.vercel.app/api/register

#### User APIs:

- Get User Profile: https://flat-sharing-app.vercel.app/api/profile
- Update Profile: https://flat-sharing-app.vercel.app/api/profile

#### Flat APIs:

- Get Flats: https://flat-sharing-app.vercel.app/api/flats
- Create Flat: https://flat-sharing-app.vercel.app/api/flats
- Update Flat: https://flat-sharing-app.vercel.app/api/flats/:flatId

#### Booking APIs:

- Get Booking Request: https://flat-sharing-app.vercel.app/api/booking-requests
- Flat Booking Request: https://flat-sharing-app.vercel.app/api/booking-applications
- Update Booking Request: https://flat-sharing-app.vercel.app/api/booking-requests/:bookingId

## Project Dependencies

#### Dependencies List

```
 "dependencies": {
"@prisma/client": "^5.11.0",
    "bcrypt": "^5.1.1",
    "body-parser": "^1.20.2",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "http-status": "^1.7.4",
    "jsonwebtoken": "^9.0.2",
    "ts-node-dev": "^2.0.0",
    "zod": "^3.22.4"
  },
```

#### Dev Dependencies List

```
 "devDependencies": {
  "@types/bcrypt": "^5.0.2",
    "@types/cookie-parser": "^1.4.7",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/node": "^20.12.2",
    "prisma": "^5.11.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.3"
    }
```
