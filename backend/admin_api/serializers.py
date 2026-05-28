from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from music.models import MoodHistory, RecommendedSong

User = get_user_model()


class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs['username'], password=attrs['password'])

        if user is None:
            raise serializers.ValidationError({'detail': 'Invalid admin credentials.'})

        if not (user.is_staff or user.is_superuser):
            raise serializers.ValidationError({'detail': 'Admin privileges are required.'})

        if not user.is_active:
            raise serializers.ValidationError({'detail': 'This admin account is inactive.'})

        refresh = RefreshToken.for_user(user)
        attrs['user'] = user
        attrs['tokens'] = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        return attrs


class AdminUserSerializer(serializers.ModelSerializer):
    joined_date = serializers.DateTimeField(source='date_joined')

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'joined_date', 'is_active', 'is_staff', 'is_superuser')
        read_only_fields = fields


class AdminUserBlockSerializer(serializers.Serializer):
    is_active = serializers.BooleanField(required=True)


class AdminMoodHistorySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    recommendation_count = serializers.SerializerMethodField()

    class Meta:
        model = MoodHistory
        fields = ('id', 'username', 'mood', 'searched_at', 'recommendation_count')
        read_only_fields = fields

    def get_recommendation_count(self, obj):
        return RecommendedSong.objects.filter(
            user=obj.user,
            mood=obj.mood,
            created_at__gte=obj.searched_at,
        ).count()
