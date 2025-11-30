"""
사용자 모델 정의
- 커스텀 User 모델을 정의합니다.
- Django의 기본 User 모델을 확장하여 추가 필드를 제공합니다.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    커스텀 사용자 모델
    - AbstractUser를 상속받아 기본 인증 기능 사용
    - 추가 필드: 프로필 이미지, 전화번호, 소속 등
    """
    email = models.EmailField('이메일', unique=True)
    phone = models.CharField('전화번호', max_length=20, blank=True)
    organization = models.CharField('소속', max_length=100, blank=True)
    profile_image = models.ImageField(
        '프로필 이미지',
        upload_to='profiles/',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField('생성일', auto_now_add=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    # 이메일을 기본 로그인 필드로 사용
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = '사용자'
        verbose_name_plural = '사용자들'

    def __str__(self):
        return self.email
