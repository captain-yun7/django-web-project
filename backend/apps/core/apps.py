"""
Core 앱 설정
- 게시글, 파일 업로드 등 핵심 기능을 담당하는 앱입니다.
"""

from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.core'
    verbose_name = '핵심 기능'
