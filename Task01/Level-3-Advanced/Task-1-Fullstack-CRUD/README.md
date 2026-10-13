# StudentHub - Student Record Management System

StudentHub is a full-stack web application for managing student records. It provides a React-based interface connected to a Node.js and Express REST API, with PostgreSQL used to store and maintain student information.

## Features

- View student records and individual student details.
- Add new student records.
- Edit existing student information.
- Delete student records.
- Search students by name, registration number, or email.
- Filter students by year of study.
- Change student status between active and inactive.
- Validate student information and prevent duplicate registration numbers and email addresses.
- Display student summaries and record counts.
- Store student information in a PostgreSQL database.
- Provide a database health-check endpoint.

## Technologies Used

**Frontend**
- React
- JavaScript
- Vite
- CSS
- Lucide React icons

**Backend**
- Node.js
- Express
- PostgreSQL client (`pg`)
- CORS
- dotenv

**Database**
- PostgreSQL

## Project Structure

Task-1-Fullstack-CRUD/
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── server.js
│   ├── db.js
│   ├── .env.example
│   └── TESTING.md
├── database/
│   ├── schema.sql
│   └── seed.sql
├── .gitignore
└── README.md


## Requirements

Install the following before running the application:

- Node.js and npm
- PostgreSQL
- Git (optional, for cloning the repository)

## Installation and Setup

### 1. Set Up the Database

Create a PostgreSQL database named `student_records_db`.

For example, from a terminal with PostgreSQL access:


createdb student_records_db


If your PostgreSQL installation requires a database username or password, use the appropriate local PostgreSQL account.

Create the tables using the supplied schema:

psql -d student_records_db -f database/schema.sql


To load the supplied sample records, run:

psql -d student_records_db -f database/seed.sql


Run the seed script only when appropriate for your database state. Check its contents first if you want to avoid inserting duplicate sample records.

### 2. Configure the Backend

Go to the server directory:

cd server

Install the dependencies:

npm install


Create your local environment file from the template:

cp .env.example .env


Open `.env` and configure the connection details for your PostgreSQL database:

env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_records_db
DB_USER=your_database_username
DB_PASSWORD=your_database_password


Replace the username and password placeholders with your own PostgreSQL credentials. Keep `.env` private and never commit database passwords or other secrets.

Start the backend:

npm run dev


The API runs at:

`http://localhost:5000/api`

### 3. Start the Frontend

Open a second terminal:

cd ~/Desktop/Codveda/Task01/Level-3-Advanced/Task-1-Fullstack-CRUD/client
npm install
npm run dev


Open the local URL printed by Vite in your terminal, usually:

`http://localhost:5173`

The frontend uses `http://localhost:5000/api` as its default API base URL. If the backend runs at a different address, configure the Vite environment variable `VITE_API_URL` accordingly.

## API Endpoints

The API base URL is `http://localhost:5000/api`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Check API and database connectivity |
| GET | `/students` | List and search student records; supports filtering |
| POST | `/students` | Create a student record |
| GET | `/students/:id` | Retrieve a student by ID |
| PUT | `/students/:id` | Update an existing student |
| PATCH | `/students/:id/status` | Change a student's status |
| DELETE | `/students/:id` | Delete a student record |

The API validates student information and returns appropriate HTTP status codes for successful requests and errors.

## Student Information

Student records can include:

- Student ID
- Registration number
- First and last name
- Email address
- Gender
- Date of birth
- Course
- Year of study
- Student status
- Phone number
- Address
- Enrollment date
- Creation and update timestamps

Registration numbers and email addresses must be unique. The database also enforces constraints on names, email format, gender, study year, and student status.

## Testing

Backend testing notes are available in [`server/TESTING.md`](server/TESTING.md).

The documented manual tests cover:

- Database connectivity and listing student records
- Searching and filtering
- Creating, viewing, updating, and deleting student records
- Handling invalid student data and invalid IDs
- Rejecting duplicate registration numbers and email addresses
- Preserving the original database records after CRUD tests

The recorded tests passed in the documented local environment.

## Available Development Commands

**Frontend** — run inside `client/`:


npm run dev
npm run build
npm run lint
npm run preview


**Backend** — run inside `server/`:


npm run dev
npm start

The backend's `npm test` script is currently a placeholder; the manual tests documented in `server/TESTING.md` are the recorded test results.

## Security Notes

- Keep database credentials in the local `server/.env` file.
- Do not commit `.env` files, passwords, or secrets.
- Use `.env.example` as a template rather than storing real credentials in the repository.
- Use a development database when testing create, update, and delete operations.

## Project Goal

The goal of StudentHub is to demonstrate a full-stack CRUD workflow, including frontend and backend integration, REST API development, database connectivity, input validation, and persistent student record management.

