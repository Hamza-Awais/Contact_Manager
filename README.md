# Contact Manager

A full stack contact management application built with the MERN stack. Users can add, view, edit and delete contacts, and all data is stored in MongoDB.

## Features

- Add a contact with name, email and phone number
- View all saved contacts
- Edit an existing contact
- Delete a contact with a confirmation prompt
- Basic validation on both the frontend and backend
- Clear error messages with proper HTTP status codes

## Tech Stack

- Frontend: React with Vite
- Backend: Node.js and Express
- Database: MongoDB Atlas with Mongoose
- Other packages: cors, dotenv

## Project Structure

```
contact_manager/
  backend/
    models/Contact.js
    routes/contacts.js
    server.js
  frontend/
    src/App.jsx
    src/index.css
    src/main.jsx
```

## API Endpoints

- GET /api/contacts - list all contacts
- POST /api/contacts - create a new contact
- PUT /api/contacts/:id - update a contact
- DELETE /api/contacts/:id - delete a contact

## Running the Project Locally

### Backend

1. Open a terminal and run `cd backend`
2. Run `npm install`
3. Create a `.env` file in the backend folder with your own values:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
4. Run `npm run dev`
5. The server runs on http://localhost:5000

### Frontend

1. Open a second terminal and run `cd frontend`
2. Run `npm install`
3. Run `npm run dev`
4. The app runs on http://localhost:5173

Both servers need to run at the same time for the app to work.

## Author

Hamza Awais
