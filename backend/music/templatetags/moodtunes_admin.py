from django import template
from django.contrib.auth import get_user_model
from django.db.models import Count

from music.models import MoodHistory, RecommendedSong

register = template.Library()


@register.simple_tag
def moodtunes_admin_metrics():
    User = get_user_model()
    top_mood = (
        MoodHistory.objects.values('mood')
        .annotate(total=Count('id'))
        .order_by('-total', 'mood')
        .first()
    )

    return {
        'total_users': User.objects.count(),
        'mood_searches': MoodHistory.objects.count(),
        'recommendations': RecommendedSong.objects.count(),
        'top_mood': top_mood['mood'] if top_mood else 'None',
    }
