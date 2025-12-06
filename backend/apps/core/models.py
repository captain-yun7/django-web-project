"""
Core 모델 정의
- 게시글(Post), 첨부파일(Attachment) 모델을 정의합니다.
"""

from django.db import models
from django.conf import settings


class Category(models.Model):
    """
    카테고리 모델
    - 게시글 분류를 위한 카테고리
    """
    name = models.CharField('카테고리명', max_length=50, unique=True)
    description = models.TextField('설명', blank=True)
    created_at = models.DateTimeField('생성일', auto_now_add=True)

    class Meta:
        verbose_name = '카테고리'
        verbose_name_plural = '카테고리들'
        ordering = ['name']

    def __str__(self):
        return self.name


class Post(models.Model):
    """
    게시글 모델
    - 제목, 내용, 작성자, 카테고리 등을 포함
    """
    title = models.CharField('제목', max_length=200)
    content = models.TextField('내용')
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posts',
        verbose_name='작성자'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='posts',
        verbose_name='카테고리'
    )
    views = models.PositiveIntegerField('조회수', default=0)
    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='liked_posts',
        blank=True,
        verbose_name='좋아요'
    )
    is_public = models.BooleanField('공개여부', default=True)
    created_at = models.DateTimeField('작성일', auto_now_add=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    class Meta:
        verbose_name = '게시글'
        verbose_name_plural = '게시글들'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def increase_views(self):
        """조회수 증가"""
        self.views += 1
        self.save(update_fields=['views'])


class Attachment(models.Model):
    """
    첨부파일 모델
    - 게시글에 첨부되는 파일을 관리
    """
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='attachments',
        verbose_name='게시글'
    )
    file = models.FileField('파일', upload_to='attachments/%Y/%m/')
    original_name = models.CharField('원본 파일명', max_length=255)
    file_size = models.PositiveIntegerField('파일 크기', default=0)
    uploaded_at = models.DateTimeField('업로드일', auto_now_add=True)

    class Meta:
        verbose_name = '첨부파일'
        verbose_name_plural = '첨부파일들'

    def __str__(self):
        return self.original_name

    def save(self, *args, **kwargs):
        if self.file:
            self.file_size = self.file.size
        super().save(*args, **kwargs)


class Comment(models.Model):
    """
    댓글 모델
    - 게시글에 달리는 댓글
    """
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='게시글'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='작성자'
    )
    content = models.TextField('내용')
    created_at = models.DateTimeField('작성일', auto_now_add=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    class Meta:
        verbose_name = '댓글'
        verbose_name_plural = '댓글들'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.author} - {self.content[:20]}"
