### Key Sections Explained:

- **Prerequisites**: Lists the necessary tools and versions required to run the project.
- **Installation**: Step-by-step guide on how to set up the project.
- **Environment Variables**: Instructions for configuring the `.env` file.
- **Database Setup**: Commands to set up the database schema using Prisma.
- **Running the Project**: How to start the server and access the API.
- **API Endpoints**: A brief list of available endpoints for quick reference.
- **Technologies Used**: The list of technologies are used in this project.

## Features

- Create, update, and delete events
- Add and remove participants from events
- Retrieve events and participants
- Data validation using Zod
- Structured error handling with custom error classes

## Prerequisites

- Node.js (v14.x or higher)
- npm or Yarn package manager
- MySQL server

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/touhidcodes/Task-Event-Management-API
   cd Task-Event-Management-API
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   # or
   yarn install

   ```

3. **Start the server:**

```bash
  npm run dev
```

## Environment Variables:

Create a .env file in the root of your project (example in `env.example`) and add the following environment variables:

```bash
 DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
 PORT=5000
```

Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE_NAME` with your MySQL database credentials.

## Database Setup:

#### 1. Migrate the database schema using Prisma:

Before running the migration, make sure your MySQL server is running and the credentials in your .env file are correct.

```bash
 npx prisma migrate dev --name init
```

#### 2. Generate Prisma Client:

Generate the Prisma client to interact with your database.

```bash
npx prisma generate
```

## Running the Project:

#### 1. Start the server:

```bash
npm run dev
# or
yarn dev
```

#### Access the API:

The server will run on http://localhost:5000 by default, or the port specified in your `.env` file.

## API Endpoints

#### Create Event

```http
  POST /api/events
```

#### Get All Events:

```http
  GET /api/events
```

#### Get Single Event:

```http
  GET /api/events/:eventId
```

| Parameter | Type  | Description                         |
| :-------- | :---- | :---------------------------------- |
| `eventId` | `Int` | **Required**. Id of events to fetch |

#### Update Event:

```http
  PATCH /api/events/:eventId
```

| Parameter | Type  | Description                         |
| :-------- | :---- | :---------------------------------- |
| `eventId` | `Int` | **Required**. Id of events to fetch |

#### Delete Event:

```http
  DELETE /api/events/:eventId
```

| Parameter | Type  | Description                         |
| :-------- | :---- | :---------------------------------- |
| `eventId` | `Int` | **Required**. Id of events to fetch |

#### Add Participant:

```http
  POST /api/events/:id/participants
```

| Parameter | Type  | Description                         |
| :-------- | :---- | :---------------------------------- |
| `id`      | `Int` | **Required**. Id of events to fetch |

#### Remove Participant:

```http
  DELETE /api/events/:id/participants/:participantId
```

| Parameter        | Type  | Description                                          |
| :--------------- | :---- | :--------------------------------------------------- |
| `id`             | `Int` | **Required**. Id of events to fetch                  |
| `participantsId` | `Int` | **Required**. participantId of participants to fetch |

## Technologies Used

**1. Node.js:** JavaScript runtime

**2. Express:** Web framework

**3. Prisma:** ORM for database interactions

**4. MySQL:** Relational database

**5. Zod:** Schema validation

**6. TypeScript:** Static typing for JavaScript

**7. dotenv:** Environment variable management
