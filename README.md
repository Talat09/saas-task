# Summarizer Backend API

A Node.js/Express backend for text summarization with user authentication, role-based access, admin controls, and rate-limited login. Supports MongoDB for data storage.

## Features
- User registration, login, and JWT authentication
- Role-based access control (user, admin, editor, reviewer)
- Text summarization using external AI API
- Admin endpoints for user management
- Rate limiting on login endpoint
- Secure password hashing

## Tech Stack
- Node.js, Express.js
- MongoDB & Mongoose
- JWT for authentication
- Helmet, CORS, Rate Limiting for security
- Winston & Morgan for logging

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB instance

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file in the root with the following:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1d
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Running the App
```bash
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login (rate limited)
- `GET /api/auth/me` — Get current user info (JWT required)

### Summaries
- `POST /api/summaries` — Create a summary (JWT required)
- `GET /api/summaries` — Get all summaries (JWT required)
- `POST /api/summaries/:id/regenerate` — Regenerate a summary (JWT required)
- `PUT /api/summaries/:id` — Update a summary (JWT + permission)
- `DELETE /api/summaries/:id` — Delete a summary (JWT + permission)

### Admin (JWT with admin role required)
- `GET /api/admin/users` — List all users
- `PUT /api/admin/users/:id/credits` — Update user credits
- `PUT /api/admin/users/:id/role` — Update user role

## Example JSON for Postman

#### Register
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```
#### Login
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
#### Create Summary
```json
{
  "prompt": "Summarize this text",
  "text": "Your long text to summarize goes here."
}
```
#### Update User Credits (Admin)
```json
{
  "credits": 10
}
```
#### Update User Role (Admin)
```json
{
  "role": "editor"
}
```

## Security
- All protected endpoints require `Authorization: Bearer <JWT_TOKEN>` header.
- Login endpoint is rate limited to 5 attempts per 15 minutes per IP.

