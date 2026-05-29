from django.urls import path

from .views import DetectEmotionView

urlpatterns = [
    path('detect-emotion/', DetectEmotionView.as_view(), name='detect-emotion'),
]
