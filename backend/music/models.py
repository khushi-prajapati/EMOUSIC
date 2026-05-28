from django.conf import settings
from django.db import models


class MoodHistory(models.Model):
    MOOD_CHOICES = (
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('angry', 'Angry'),
        ('relaxed', 'Relaxed'),
        ('energetic', 'Energetic'),
        ('romantic', 'Romantic'),
        ('focus', 'Focus'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mood_history')
    mood = models.CharField(max_length=32, choices=MOOD_CHOICES)
    searched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-searched_at',)
        verbose_name_plural = 'mood histories'

    def __str__(self):
        return f'{self.user} searched {self.mood}'


class RecommendedSong(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recommended_songs')
    mood = models.CharField(max_length=32, choices=MoodHistory.MOOD_CHOICES)
    title = models.CharField(max_length=255)
    youtube_video_id = models.CharField(max_length=64)
    thumbnail_url = models.URLField(max_length=500, blank=True)
    channel_title = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return self.title
