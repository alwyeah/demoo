from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class ResumeResponse(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime
    raw_text: Optional[str] = None

    class Config:
        from_attributes = True

class AnalysisResponse(BaseModel):
    id: int
    resume_id: int
    job_description: Optional[str] = None
    match_score: Optional[int] = None
    extracted_skills: Optional[str] = None
    feedback: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True