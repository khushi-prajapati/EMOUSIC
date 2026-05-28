from django.contrib.auth import get_user_model
from django.db.models import Count

from music.models import MoodHistory, RecommendedSong

User = get_user_model()


class AdminDashboardService:
    @staticmethod
    def get_stats():
        top_moods = list(
            MoodHistory.objects.values('mood')
            .annotate(count=Count('id'))
            .order_by('-count', 'mood')[:7]
        )
        most_selected_mood = top_moods[0]['mood'] if top_moods else None
        recent_activity = list(
            MoodHistory.objects.select_related('user')
            .order_by('-searched_at')[:10]
            .values('id', 'user__username', 'mood', 'searched_at')
        )

        return {
            'total_users': User.objects.count(),
            'total_playlists': MoodHistory.objects.count(),
            'total_recommendations': RecommendedSong.objects.count(),
            'most_selected_mood': most_selected_mood,
            'top_moods': top_moods,
            'recent_activity': [
                {
                    'id': item['id'],
                    'username': item['user__username'],
                    'mood': item['mood'],
                    'searched_at': item['searched_at'],
                }
                for item in recent_activity
            ],
        }
