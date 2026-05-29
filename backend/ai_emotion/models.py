from django.conf import settings
from django.db import models

from music.models import MoodHistory


class EmotionDetectionHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='emotion_detections',
    )
    detected_emotion = models.CharField(max_length=32)
    mapped_mood = models.CharField(max_length=32, choices=MoodHistory.MOOD_CHOICES)
    confidence = models.DecimalField(max_digits=5, decimal_places=4)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)
        verbose_name_plural = 'emotion detection history'

    def __str__(self):
        return f'{self.user} detected {self.detected_emotion}'
