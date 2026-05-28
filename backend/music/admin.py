from django.contrib import admin

from .models import MoodHistory, RecommendedSong


@admin.register(MoodHistory)
class MoodHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'mood', 'searched_at')
    list_filter = ('mood', 'searched_at')
    search_fields = ('user__username', 'user__email', 'mood')


@admin.register(RecommendedSong)
class RecommendedSongAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'mood', 'channel_title', 'created_at')
    list_filter = ('mood', 'created_at')
    search_fields = ('title', 'channel_title', 'user__username', 'youtube_video_id')
