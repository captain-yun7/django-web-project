"""
Core 앱 URL 설정
- 게시글, 카테고리, 검색 관련 API 엔드포인트를 정의합니다.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import CategoryViewSet, PostViewSet, CommentViewSet, SearchView

# 기본 라우터
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'posts', PostViewSet, basename='post')

# 중첩 라우터 (게시글 -> 댓글)
posts_router = routers.NestedDefaultRouter(router, r'posts', lookup='post')
posts_router.register(r'comments', CommentViewSet, basename='post-comments')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(posts_router.urls)),
    path('search/', SearchView.as_view(), name='search'),
]
