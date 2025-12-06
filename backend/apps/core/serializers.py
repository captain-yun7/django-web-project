"""
Core 시리얼라이저
- 게시글, 첨부파일, 댓글 등의 직렬화/역직렬화를 담당합니다.
"""

from rest_framework import serializers
from .models import Category, Post, Attachment, Comment


class CategorySerializer(serializers.ModelSerializer):
    """카테고리 시리얼라이저"""
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class AttachmentSerializer(serializers.ModelSerializer):
    """첨부파일 시리얼라이저"""
    class Meta:
        model = Attachment
        fields = ['id', 'file', 'original_name', 'file_size', 'uploaded_at']
        read_only_fields = ['file_size', 'uploaded_at']


class CommentSerializer(serializers.ModelSerializer):
    """댓글 시리얼라이저"""
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'author_name', 'created_at', 'updated_at']
        read_only_fields = ['author', 'created_at', 'updated_at']


class PostListSerializer(serializers.ModelSerializer):
    """게시글 목록용 시리얼라이저"""
    author_name = serializers.CharField(source='author.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    comment_count = serializers.IntegerField(source='comments.count', read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'author', 'author_name', 'category',
            'category_name', 'views', 'comment_count', 'likes_count', 'created_at'
        ]


class PostDetailSerializer(serializers.ModelSerializer):
    """게시글 상세용 시리얼라이저"""
    author_name = serializers.CharField(source='author.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'content', 'author', 'author_name',
            'category', 'category_name', 'views', 'is_public',
            'likes_count', 'is_liked', 'attachments', 'comments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['author', 'views', 'created_at', 'updated_at']

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False


class PostCreateSerializer(serializers.ModelSerializer):
    """게시글 생성용 시리얼라이저"""
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'category', 'is_public']
        read_only_fields = ['id']
