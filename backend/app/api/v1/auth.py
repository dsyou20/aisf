from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional

from app.database import get_db
from app.core.security import create_access_token, verify_password
from app.schemas.user import UserCreate, User
from app.services.auth_service import authenticate_user, get_current_user
from app.core.dependencies import get_db_optional

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db_optional)):
    """사용자 로그인"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="잘못된 사용자명 또는 비밀번호",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }

@router.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db_optional)):
    """사용자 등록"""
    # 실제 구현에서는 사용자 생성 로직 추가
    return {"message": "사용자 등록 기능은 구현 예정입니다."}

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """현재 로그인한 사용자 정보"""
    return current_user

@router.post("/logout")
async def logout():
    """사용자 로그아웃"""
    return {"message": "로그아웃되었습니다."} 