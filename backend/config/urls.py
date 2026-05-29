from django.contrib import admin
from django.urls import include, path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

admin.site.site_title = 'MoodTunes Admin'
admin.site.site_header = 'MoodTunes Administration'
admin.site.index_title = 'Welcome to MoodTunes Admin'
admin.site.index_template = 'admin/moodtunes_index.html'


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({'status': 'ok', 'service': 'MoodTunes API'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/ai/', include('ai_emotion.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/auth/', include('authentication.urls')),
    path('api/music/', include('music.urls')),
]
