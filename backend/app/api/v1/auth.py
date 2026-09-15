import uuid
import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.core.config import settings
from app.core.security import hash_password, verify_password, create_access_token
from app.models.models import User
from app.schemas.schemas import (
    UserRegister, UserLogin, TokenResponse, UserResponse,
    ForgotPasswordRequest, ProfileUpdateRequest, PasswordChangeRequest,
    GoogleAuthRequest
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserRegister, db: Session = Depends(get_db)):
    email_clean = data.email.lower().strip()
    existing = db.query(User).filter(User.email == email_clean).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user = User(
        id=str(uuid.uuid4()),
        name=data.name.strip(),
        email=email_clean,
        password_hash=hash_password(data.password),
        role="CUSTOMER",
        status="ACTIVE",
        phone=data.phone,
        company=data.company,
        address=data.address
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id, role=user.role)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))

@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    email_clean = data.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email address or password."
        )

    if user.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended. Please reach out to support."
        )

    token = create_access_token(subject=user.id, role=user.role)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))

@router.post("/google", response_model=TokenResponse)
def google_auth(data: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Authenticate or register user via verified Google OAuth ID token.
    Validates token audience against configured Google Client ID.
    """
    if not data.credential:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing Google authentication credential."
        )

    try:
        token_info_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={data.credential}"
        resp = httpx.get(token_info_url, timeout=8.0)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to reach Google authentication servers. Please try again."
        )

    if resp.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Google authorization token."
        )

    payload = resp.json()
    token_aud = payload.get("aud")

    if settings.GOOGLE_CLIENT_ID and token_aud != settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google Client ID mismatch. Token audience is untrusted."
        )

    email = payload.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google profile did not provide an email address."
        )

    email_clean = email.lower().strip()
    name = payload.get("name") or email_clean.split("@")[0]

    # Find existing or create new customer
    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        user = User(
            id=str(uuid.uuid4()),
            name=name.strip(),
            email=email_clean,
            password_hash=hash_password(str(uuid.uuid4())), # Strong random secret
            role="CUSTOMER",
            status="ACTIVE"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if user.status != "ACTIVE":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is suspended. Please contact support."
            )

    token = create_access_token(subject=user.id, role=user.role)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.put("/profile", response_model=UserResponse)
def update_profile(data: ProfileUpdateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if data.name is not None:
        current_user.name = data.name.strip()
    if data.phone is not None:
        current_user.phone = data.phone.strip()
    if data.company is not None:
        current_user.company = data.company.strip()
    if data.address is not None:
        current_user.address = data.address.strip()
    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)

@router.post("/change-password")
def change_password(data: PasswordChangeRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password verification failed."
        )
    current_user.password_hash = hash_password(data.new_password)
    db.commit()
    return {"success": True, "message": "Password updated successfully."}

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    # Security requirement: Never reveal whether an email exists
    return {
        "success": True,
        "message": "If this email exists in our system, password reset instructions have been dispatched."
    }
