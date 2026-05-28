from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from music.models import MoodHistory

from .permissions import IsAdminUserRole
from .serializers import (
    AdminLoginSerializer,
    AdminMoodHistorySerializer,
    AdminUserBlockSerializer,
    AdminUserSerializer,
)
from .services import AdminDashboardService

User = get_user_model()


class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(
            {
                'message': 'Admin login successful.',
                'user': AdminUserSerializer(serializer.validated_data['user']).data,
                'tokens': serializer.validated_data['tokens'],
            },
            status=status.HTTP_200_OK,
        )


class AdminStatsView(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        return Response(AdminDashboardService.get_stats())


class AdminUserListView(generics.ListAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUserRole]

    def get_queryset(self):
        return User.objects.order_by('-date_joined')


class AdminUserBlockView(APIView):
    permission_classes = [IsAdminUserRole]

    def patch(self, request, pk):
        serializer = AdminUserBlockSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = generics.get_object_or_404(User, pk=pk)

        if user.is_superuser and user.pk == request.user.pk:
            return Response(
                {'detail': 'You cannot block your own superuser account.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = serializer.validated_data['is_active']
        user.save(update_fields=['is_active'])

        return Response({'message': 'User status updated.', 'user': AdminUserSerializer(user).data})


class AdminUserDeleteView(APIView):
    permission_classes = [IsAdminUserRole]

    def delete(self, request, pk):
        user = generics.get_object_or_404(User, pk=pk)

        if user.pk == request.user.pk:
            return Response(
                {'detail': 'You cannot delete your own account.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminHistoryView(generics.ListAPIView):
    serializer_class = AdminMoodHistorySerializer
    permission_classes = [IsAdminUserRole]

    def get_queryset(self):
        return MoodHistory.objects.select_related('user').order_by('-searched_at')
