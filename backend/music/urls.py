from django.urls import path

from .views import MoodListView, RecommendView, RecommendationHistoryView

urlpatterns = [
    path('moods/', MoodListView.as_view(), name='moods'),
    path('recommend/', RecommendView.as_view(), name='recommend'),
    path('history/', RecommendationHistoryView.as_view(), name='history'),
]
