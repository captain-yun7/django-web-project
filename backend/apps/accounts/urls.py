"""
Accounts 앱 URL 설정
- 사용자 인증 관련 API 엔드포인트를 정의합니다.
"""

from django.urls import path
from .views import (
    RegisterView,
    ProfileView,
    ChangePasswordView,
    UserListView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('users/', UserListView.as_view(), name='user-list'),
]
