from rest_framework import serializers

from .constants import SUPPORTED_MOODS
from .models import MoodHistory, RecommendedSong


class MoodSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()
    icon = serializers.CharField()


class RecommendRequestSerializer(serializers.Serializer):
    mood = serializers.ChoiceField(choices=list(SUPPORTED_MOODS.keys()))


class RecommendedSongSerializer(serializers.ModelSerializer):
    videoId = serializers.CharField(source='youtube_video_id')
    thumbnail = serializers.URLField(source='thumbnail_url')
    channel = serializers.CharField(source='channel_title')

    class Meta:
        model = RecommendedSong
        fields = (
            'id',
            'mood',
            'title',
            'videoId',
            'thumbnail',
            'channel',
            'youtube_video_id',
            'thumbnail_url',
            'channel_title',
            'created_at',
        )
        read_only_fields = fields


class MoodHistorySerializer(serializers.ModelSerializer):
    recommendations = serializers.SerializerMethodField()

    class Meta:
        model = MoodHistory
        fields = ('id', 'mood', 'searched_at', 'recommendations')
        read_only_fields = fields

    def get_recommendations(self, obj):
        next_search = MoodHistory.objects.filter(
            user=obj.user,
            searched_at__gt=obj.searched_at,
        ).order_by('searched_at').first()
        songs = RecommendedSong.objects.filter(
            user=obj.user,
            mood=obj.mood,
            created_at__gte=obj.searched_at,
        )

        if next_search:
            songs = songs.filter(created_at__lt=next_search.searched_at)

        songs = songs.order_by('created_at')[:10]
        return RecommendedSongSerializer(songs, many=True).data
