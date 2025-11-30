"""
URL 라우팅 설정
- 이 파일은 모든 URL 경로를 정의합니다.
- API 엔드포인트와 관리자 페이지 URL이 포함됩니다.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # 관리자 페이지
    path('admin/', admin.site.urls),

    # JWT 토큰 API
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 앱별 API 엔드포인트
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/', include('apps.core.urls')),
]

# 개발 환경에서 미디어 파일 서빙
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
