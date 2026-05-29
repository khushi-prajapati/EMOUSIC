from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    FavoriteDeleteView,
    FavoriteListCreateView,
    MoodListView,
    PlaylistViewSet,
    RecommendView,
    RecommendationHistoryView,
    SpotifySearchView,
)

router = DefaultRouter()
router.register('playlists', PlaylistViewSet, basename='playlist')

urlpatterns = [
    path('moods/', MoodListView.as_view(), name='moods'),
    path('recommend/', RecommendView.as_view(), name='recommend'),
    path('spotify/search/', SpotifySearchView.as_view(), name='spotify-search'),
    path('history/', RecommendationHistoryView.as_view(), name='history'),
    path('favorites/', FavoriteListCreateView.as_view(), name='favorites'),
    path('favorites/<int:song_id>/', FavoriteDeleteView.as_view(), name='favorite-delete'),
    path('', include(router.urls)),
]
