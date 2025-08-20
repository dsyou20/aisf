from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db

router = APIRouter()

@router.get("/houses")
async def get_houses(db: Session = Depends(get_db)):
    """하우스 목록 조회"""
    return {"message": "하우스 목록 조회 기능은 구현 예정입니다."}

@router.get("/houses/{house_id}")
async def get_house(house_id: int, db: Session = Depends(get_db)):
    """특정 하우스 조회"""
    return {"message": f"하우스 {house_id} 조회 기능은 구현 예정입니다."}

@router.post("/houses")
async def create_house(db: Session = Depends(get_db)):
    """새 하우스 생성"""
    return {"message": "하우스 생성 기능은 구현 예정입니다."}

@router.put("/houses/{house_id}")
async def update_house(house_id: int, db: Session = Depends(get_db)):
    """하우스 정보 수정"""
    return {"message": f"하우스 {house_id} 수정 기능은 구현 예정입니다."}

@router.delete("/houses/{house_id}")
async def delete_house(house_id: int, db: Session = Depends(get_db)):
    """하우스 삭제"""
    return {"message": f"하우스 {house_id} 삭제 기능은 구현 예정입니다."} 