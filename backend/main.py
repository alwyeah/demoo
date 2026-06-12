from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import auth, resumes

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Resume Analyzer API",
    description="AI-powered resume analysis and job matching",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(resumes.router)

@app.get("/")
def root():
    return {"message": "Resume Analyzer API is running"}