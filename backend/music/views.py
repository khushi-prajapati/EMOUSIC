from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .constants import SUPPORTED_MOODS
from .models import MoodHistory, RecommendedSong
from .serializers import (
    MoodHistorySerializer,
    MoodSerializer,
    RecommendRequestSerializer,
    RecommendedSongSerializer,
)
from .services import YouTubeRecommendationService


class MoodListView(APIView):
    def get(self, request):
        moods = [
            {'value': key, 'label': value['label'], 'icon': value['icon']}
            for key, value in SUPPORTED_MOODS.items()
        ]
        return Response(MoodSerializer(moods, many=True).data)


class RecommendView(APIView):
    def post(self, request):
        serializer = RecommendRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        mood = serializer.validated_data['mood']
        songs = YouTubeRecommendationService().search_by_mood(mood, max_results=10)
        MoodHistory.objects.create(user=request.user, mood=mood)

        saved_songs = [
            RecommendedSong.objects.create(user=request.user, mood=mood, **song)
            for song in songs
        ]

        return Response(
            {
                'mood': mood,
                'songs': RecommendedSongSerializer(saved_songs, many=True).data,
            },
            status=status.HTTP_201_CREATED,
        )


class RecommendationHistoryView(generics.ListAPIView):
    serializer_class = MoodHistorySerializer
    pagination_class = None

    def get_queryset(self):
        return MoodHistory.objects.filter(user=self.request.user).order_by('-searched_at')
