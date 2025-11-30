"""
Core 관리자 페이지 설정
- Django Admin에서 게시글, 카테고리 등을 관리할 수 있도록 설정합니다.
"""

from django.contrib import admin
from .models import Category, Post, Attachment, Comment


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """카테고리 관리자"""
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name']


class AttachmentInline(admin.TabularInline):
    """첨부파일 인라인"""
    model = Attachment
    extra = 0


class CommentInline(admin.TabularInline):
    """댓글 인라인"""
    model = Comment
    extra = 0


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """게시글 관리자"""
    list_display = ['title', 'author', 'category', 'views', 'is_public', 'created_at']
    list_filter = ['category', 'is_public', 'created_at']
    search_fields = ['title', 'content', 'author__username']
    inlines = [AttachmentInline, CommentInline]
    ordering = ['-created_at']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """댓글 관리자"""
    list_display = ['post', 'author', 'content', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content', 'author__username']
