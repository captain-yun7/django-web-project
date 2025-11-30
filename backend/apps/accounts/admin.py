"""
Accounts 관리자 페이지 설정
- Django Admin에서 사용자를 관리할 수 있도록 설정합니다.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """커스텀 사용자 관리자"""
    list_display = ['email', 'username', 'organization', 'is_active', 'created_at']
    list_filter = ['is_active', 'is_staff', 'created_at']
    search_fields = ['email', 'username', 'organization']
    ordering = ['-created_at']

    fieldsets = UserAdmin.fieldsets + (
        ('추가 정보', {'fields': ('phone', 'organization', 'profile_image')}),
    )
