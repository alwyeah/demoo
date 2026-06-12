from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import auth

# Create all database tables automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Resume Analyzer API",
    description="AI-powered resume analysis and job matching",
    version="1.0.0"
)

# Allow React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Resume Analyzer API is running"}