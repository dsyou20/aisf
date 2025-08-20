from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def authenticate_user(db: Session, username: str, password: str):
    """사용자 인증 (임시 구현)"""
    # 데이터베이스 연결이 없어도 기본 인증 허용
    if username == "admin" and password == "admin":
        return User(
            id=1,
            username="admin",
            email="admin@smartfarm.com",
            role="admin"
        )
    return None

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """현재 사용자 조회 (임시 구현)"""
    # 실제 구현에서는 토큰 검증 후 사용자 조회
    return User(
        id=1,
        username="admin",
        email="admin@smartfarm.com",
        role="admin"
    ) 