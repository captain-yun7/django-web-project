"""
Accounts 앱 설정
- 사용자 인증, 회원가입, 로그인 기능을 담당하는 앱입니다.
"""

from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.accounts'
    verbose_name = '사용자 관리'
