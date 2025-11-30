"""
사용자 시리얼라이저
- API 요청/응답 데이터의 직렬화/역직렬화를 담당합니다.
- 회원가입, 사용자 정보 조회 등에 사용됩니다.
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    회원가입용 시리얼라이저
    - 비밀번호 확인 필드 포함
    - 비밀번호 유효성 검사 적용
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2', 'phone', 'organization']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "비밀번호가 일치하지 않습니다."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    """
    사용자 정보 시리얼라이저
    - 사용자 정보 조회 및 수정에 사용
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'phone', 'organization', 'profile_image', 'created_at']
        read_only_fields = ['id', 'email', 'created_at']


class ChangePasswordSerializer(serializers.Serializer):
    """
    비밀번호 변경용 시리얼라이저
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
