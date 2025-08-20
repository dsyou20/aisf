from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db

def get_db_optional():
    """선택적 데이터베이스 연결 (연결 실패 시 None 반환)"""
    try:
        db = next(get_db())
        return db
    except Exception:
        return None

def require_db(db: Session = Depends(get_db_optional)):
    """데이터베이스가 필요한 엔드포인트용 의존성"""
    if db is None:
        raise HTTPException(
            status_code=503,
            detail="데이터베이스 서비스를 사용할 수 없습니다. 잠시 후 다시 시도해주세요."
        )
    return db 