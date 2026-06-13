# AI Resume Analyzer & Job Matcher

This is a full-stack web application that allows users to upload their resumes (PDF/DOCX), extracts their skills using AI, and scores how well they match a given job description.

## API Documentation
Below is the Swagger API documentation for the backend endpoints:

![API Documentation](api-docs2.jpeg)

## How to Run the Project locally

### 1. Start the Backend
Open a terminal, navigate to the backend folder, activate the virtual environment, and run the server:
`cd backend`
`venv\Scripts\activate`
`uvicorn main:app --reload`

### 2. Start the Frontend
Open a second terminal, navigate to the frontend folder, and start the React app:
`cd frontend`
`npm run dev`

### 3. Access the App
Open your browser and go to `http://localhost:5173` to use the application.
