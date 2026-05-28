from django.urls import path

from .views import (
    AdminHistoryView,
    AdminLoginView,
    AdminStatsView,
    AdminUserBlockView,
    AdminUserDeleteView,
    AdminUserListView,
)

urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='admin-login'),
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('users/', AdminUserListView.as_view(), name='admin-users'),
    path('users/<int:pk>/block/', AdminUserBlockView.as_view(), name='admin-user-block'),
    path('users/<int:pk>/', AdminUserDeleteView.as_view(), name='admin-user-delete'),
    path('history/', AdminHistoryView.as_view(), name='admin-history'),
]
