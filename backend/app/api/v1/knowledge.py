from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db

router = APIRouter()

@router.get("/knowledge/basic")
async def get_basic_knowledge(db: Session = Depends(get_db)):
    """기본 지식 조회"""
    return {"message": "기본 지식 조회 기능은 구현 예정입니다."}

@router.get("/knowledge/experience")
async def get_experience_knowledge(db: Session = Depends(get_db)):
    """경험 지식 조회"""
    return {"message": "경험 지식 조회 기능은 구현 예정입니다."}

@router.get("/knowledge/environment-model")
async def get_environment_model(db: Session = Depends(get_db)):
    """환경 모델 조회"""
    return {"message": "환경 모델 조회 기능은 구현 예정입니다."}

@router.get("/knowledge/growth-model")
async def get_growth_model(db: Session = Depends(get_db)):
    """생육 모델 조회"""
    return {"message": "생육 모델 조회 기능은 구현 예정입니다."}

@router.get("/knowledge/disease-model")
async def get_disease_model(db: Session = Depends(get_db)):
    """병해 모델 조회"""
    return {"message": "병해 모델 조회 기능은 구현 예정입니다."}

@router.get("/knowledge/recommendation-model")
async def get_recommendation_model(db: Session = Depends(get_db)):
    """재배 추천 모델 조회"""
    return {"message": "재배 추천 모델 조회 기능은 구현 예정입니다."}

@router.get("/knowledge/control-model")
async def get_control_model(db: Session = Depends(get_db)):
    """제어 관리 모델 조회"""
    return {"message": "제어 관리 모델 조회 기능은 구현 예정입니다."} 