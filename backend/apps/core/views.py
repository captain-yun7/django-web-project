"""
Core 뷰 (API 엔드포인트)
- 게시글 CRUD, 파일 업로드, 검색 등의 API를 제공합니다.
"""

from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.conf import settings
from django.db import models
import os

from .models import Category, Post, Attachment, Comment
from .serializers import (
    CategorySerializer,
    PostListSerializer,
    PostDetailSerializer,
    PostCreateSerializer,
    AttachmentSerializer,
    CommentSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    카테고리 API
    - GET /api/categories/ : 목록 조회
    - POST /api/categories/ : 생성 (관리자)
    - GET /api/categories/{id}/ : 상세 조회
    - PUT/PATCH /api/categories/{id}/ : 수정 (관리자)
    - DELETE /api/categories/{id}/ : 삭제 (관리자)
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class PostViewSet(viewsets.ModelViewSet):
    """
    게시글 API
    - GET /api/posts/ : 목록 조회 (검색, 필터링 지원)
    - POST /api/posts/ : 생성
    - GET /api/posts/{id}/ : 상세 조회
    - PUT/PATCH /api/posts/{id}/ : 수정
    - DELETE /api/posts/{id}/ : 삭제
    """
    queryset = Post.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'author', 'is_public']
    search_fields = ['title', 'content']  # 검색 기능
    ordering_fields = ['created_at', 'views', 'title']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return PostListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return PostCreateSerializer
        return PostDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = Post.objects.all()
        # 비인증 사용자는 공개 게시글만 볼 수 있음
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_public=True)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.increase_views()  # 조회수 증가
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        """
        좋아요 토글 API
        - POST /api/posts/{id}/like/
        """
        post = self.get_object()
        user = request.user

        if user in post.likes.all():
            post.likes.remove(user)
            liked = False
        else:
            post.likes.add(user)
            liked = True

        return Response({
            'liked': liked,
            'likes_count': post.likes.count()
        })

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_file(self, request, pk=None):
        """
        파일 업로드 API
        - POST /api/posts/{id}/upload_file/
        """
        post = self.get_object()
        file = request.FILES.get('file')

        if not file:
            return Response({"error": "파일이 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)

        # 파일 확장자 검증 (보안)
        ext = os.path.splitext(file.name)[1].lower()
        if ext not in settings.ALLOWED_FILE_EXTENSIONS:
            return Response(
                {"error": f"허용되지 않는 파일 형식입니다. 허용: {settings.ALLOWED_FILE_EXTENSIONS}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 파일 크기 검증
        if file.size > settings.FILE_UPLOAD_MAX_MEMORY_SIZE:
            return Response(
                {"error": "파일 크기가 너무 큽니다. (최대 10MB)"},
                status=status.HTTP_400_BAD_REQUEST
            )

        attachment = Attachment.objects.create(
            post=post,
            file=file,
            original_name=file.name
        )
        return Response(AttachmentSerializer(attachment).data, status=status.HTTP_201_CREATED)


class CommentViewSet(viewsets.ModelViewSet):
    """
    댓글 API
    - GET /api/posts/{post_id}/comments/ : 해당 게시글의 댓글 목록
    - POST /api/posts/{post_id}/comments/ : 댓글 작성
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs.get('post_pk')
        return Comment.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_pk')
        serializer.save(author=self.request.user, post_id=post_id)


class SearchView(generics.ListAPIView):
    """
    통합 검색 API
    - GET /api/search/?q=검색어
    - 제목과 내용에서 검색
    """
    serializer_class = PostListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if query:
            return Post.objects.filter(
                is_public=True,
                title__icontains=query
            )
        return Post.objects.none()
