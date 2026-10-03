# TaskMaster API

TaskMaster is the backend (the "behind the scenes" engine) for a productivity app.

It lets people:

- Create an account and log in
- Create **projects** (like "Build My Website")
- Add **tasks** inside each project (like "Design the homepage")
- Update and delete their own projects and tasks

Most importantly, it keeps everyone's data private. **Users can only see and change their own projects and tasks.** If someone tries to touch another person's data, the API blocks them.

---

## Tech Stack (the tools used)

| Tool | What it does |
|---|---|
| **Node.js** | Runs JavaScript on a server instead of in a browser |
| **Express** | Makes it easy to build the server and its routes (the "doors" people send requests to) |
| **MongoDB** | The database where all users, projects, and tasks are saved |
| **Mongoose** | Lets the app talk to MongoDB using schemas (blueprints for what data should look like) |
| **bcrypt** | Scrambles passwords before saving them, so real passwords are never stored |
| **jsonwebtoken (JWT)** | Creates login tokens, like a wristband that proves you're logged in |
| **dotenv** | Loads secret settings from a `.env` file so they're never written in the code |

---

## How to Run This Project on Your Computer

### What you need first

- [Node.js](https://nodejs.org/) installed
- A MongoDB database. You can get a free one at [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Postman](https://www.postman.com/downloads/) for testing (optional, but recommended)

### Step 1: Download the project

```bash
git clone https://github.com/essencenroberts/Task-Master-API.git
cd Task-Master-API
```

### Step 2: Install the packages

```bash
npm install
```

This reads `package.json` and downloads every tool the project needs into a `node_modules` folder.

### Step 3: Create your `.env` file

Create a file named `.env` in the main project folder and add these three lines:

```
MONGO_URI=your_mongodb_connection_string
PORT=3009
JWT_SECRET=your_long_random_secret
```

- **MONGO_URI** is the address of your MongoDB database (get it from MongoDB Atlas).
- **PORT** is the "door number" your server listens on.
- **JWT_SECRET** is a secret password the server uses to sign login tokens. Make it long and random. You can generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

> ⚠️ Never upload your `.env` file to GitHub. It's already listed in `.gitignore`, so Git will skip it.

### Step 4: Start the server

```bash
npm run dev
```

If everything works, you'll see:

```
Server running on port: http://localhost:3009
Successfully connected to MongoDB
```

---

## Folder Structure

Each folder has one job, which keeps the code organized and easy to find.

```
Task-Master-API/
├── config/
│   └── connection.js       → Connects the app to MongoDB
├── models/
│   ├── userSchema.js       → Blueprint for users (includes password hashing)
│   ├── projectSchema.js    → Blueprint for projects
│   ├── taskSchema.js       → Blueprint for tasks
│   └── index.js            → Exports all models from one place
├── routes/
│   └── api/
│       ├── index.js        → Connects all the route files together
│       ├── userRoutes.js   → Register and login
│       ├── projectRoutes.js→ Create, read, update, delete projects
│       └── taskRoutes.js   → Create, read, update, delete tasks
├── utils/
│   └── authentication.js   → Login tokens, the security guard, and ownership checks
├── .env                    → Secret settings (NOT uploaded to GitHub)
├── .gitignore              → Tells Git which files to skip
├── package.json            → Project info and list of packages
└── server.js               → The starting point of the app
```

---

## Data Models (what gets saved)

The app saves three kinds of data. They connect like this:

```
USER  ──owns many──►  PROJECT  ──has many──►  TASK
```

### User

| Field | Type | Rules |
|---|---|---|
| username | String | Required, unique |
| email | String | Required, unique, must look like a real email, saved in lowercase |
| password | String | Required, at least 8 characters, **hashed with bcrypt before saving** |

Passwords are scrambled automatically by a **pre-save hook**, a function that runs right before a user is saved. Even if someone looked inside the database, they would only see scrambled text, never the real password.

### Project

| Field | Type | Rules |
|---|---|---|
| name | String | Required |
| description | String | Optional |
| user | ObjectId (ref: `User`) | Required. This is the **owner** of the project |

### Task

| Field | Type | Rules |
|---|---|---|
| title | String | Required |
| description | String | Optional |
| status | String | Must be `To Do`, `In Progress`, or `Done`. Starts as `To Do` |
| project | ObjectId (ref: `Project`) | Required. This is the project the task belongs to |

---

## API Endpoints (the "doors" you can knock on)

All addresses start with `http://localhost:3009`.

### Users

| Method | Route | What it does | Who can use it |
|---|---|---|---|
| POST | `/api/users/register` | Create a new account | Anyone |
| POST | `/api/users/login` | Log in and get a token | Anyone |

### Projects

| Method | Route | What it does | Who can use it |
|---|---|---|---|
| POST | `/api/projects` | Create a project | Logged-in users |
| GET | `/api/projects` | Get all of **your** projects | Logged-in users |
| GET | `/api/projects/:id` | Get one project | The owner only |
| PUT | `/api/projects/:id` | Update a project | The owner only |
| DELETE | `/api/projects/:id` | Delete a project **and all its tasks** | The owner only |

### Tasks

| Method | Route | What it does | Who can use it |
|---|---|---|---|
| POST | `/api/projects/:projectId/tasks` | Add a task to a project | Owner of that project |
| GET | `/api/projects/:projectId/tasks` | Get all tasks in a project | Owner of that project |
| PUT | `/api/tasks/:taskId` | Update a task | Owner of the task's project |
| DELETE | `/api/tasks/:taskId` | Delete a task | Owner of the task's project |

> In a route, a word that starts with `:` (like `:id`) is a placeholder. You replace it with a real id, for example `/api/projects/6712ab34cd56ef7890123456`.

---

## How Login Works (Authentication)

Think of it like an amusement park:

1. **Register or log in.** This is like buying a ticket at the entrance.
2. **The server gives you a token.** This is your wristband. It lasts 2 hours.
3. **Show your token on every protected request.** Ride operators check your wristband instead of making you buy a new ticket each time.

To send your token, add this header to your request:

```
Authorization: Bearer <your_token>
```

In Postman, go to the **Authorization** tab, choose **Bearer Token**, and paste your token.

---

## How Privacy Works (Authorization)

Being logged in proves **who you are**. The API also checks **what you're allowed to touch**.

- **Projects:** Before you can view, update, or delete a project, the API checks that **you** are the project's owner.
- **Tasks:** Tasks don't store their owner directly, so the API does a chain check: it finds the task, finds the project the task belongs to, and checks that **you** own that project.

---

## Status Codes (what the responses mean)

| Code | Meaning | When you'll see it |
|---|---|---|
| **200** OK | It worked | Getting, updating, or deleting something |
| **201** Created | Something new was made | Registering, creating a project or task |
| **400** Bad Request | Something was wrong with what you sent | Missing fields, short password, invalid status, duplicate email |
| **401** Unauthorized | You're not logged in | No token, a fake token, or an expired token |
| **403** Forbidden | You're logged in, but this isn't yours | Trying to access another user's project or task |
| **404** Not Found | It doesn't exist | The project or task id doesn't match anything |
| **500** Server Error | Something broke on the server | Check the terminal for the error message |

---

## Example Requests

### Register

**POST** `/api/users/register`

```json
{
  "username": "userA",
  "email": "a@test.com",
  "password": "password123"
}
```

### Create a project

**POST** `/api/projects` (needs a token)

```json
{
  "name": "Website",
  "description": "Build my site"
}
```

### Add a task to a project

**POST** `/api/projects/<projectId>/tasks` (needs a token)

```json
{
  "title": "Design homepage"
}
```

### Update a task's status

**PUT** `/api/tasks/<taskId>` (needs a token)

```json
{
  "status": "In Progress"
}
```

---

## Testing

Every endpoint was tested in Postman, including the security rules:

- ✅ Requests without a token are blocked with **401**
- ✅ Duplicate emails and invalid data are rejected with **400**
- ✅ When User B tries to view, update, or delete User A's projects or tasks, the API returns **403**
- ✅ `GET /api/projects` only shows the logged-in user's own projects
- ✅ Deleting a project also deletes its tasks

---

## Author

Essence [GitHub](https://github.com/essencenroberts/30days-backend)