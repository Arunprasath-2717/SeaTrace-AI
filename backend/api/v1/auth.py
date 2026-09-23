from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.core.security import verify_password, create_access_token, hash_password
from backend.core.config import settings
from backend.models.user import User
from backend.schemas.auth import LoginRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Authenticate user with username and password, returning JWT access token.
    If default operator does not exist in DB yet, auto-provisions it on first login for convenience.
    """
    user = db.query(User).filter(User.username == login_data.username).first()
    
    # Auto-seed initial operator account if database is freshly created
    if not user and login_data.username == "operator@oceantrace.io" and login_data.password == "SecurePassword123!":
        user = User(
            username="operator@oceantrace.io",
            hashed_password=hash_password("SecurePassword123!"),
            full_name="Lead Maritime Analyst",
            role="operator",
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    access_token = create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user)
    )
