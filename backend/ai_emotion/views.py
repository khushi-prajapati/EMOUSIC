from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import EmotionDetectionHistory
from .serializers import EmotionDetectionRequestSerializer, EmotionDetectionResponseSerializer
from .services.emotion_detector import EmotionDetectionError, EmotionDetector


class DetectEmotionView(APIView):
    def post(self, request):
        serializer = EmotionDetectionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            result = EmotionDetector().detect(serializer.validated_data['image'])
        except EmotionDetectionError as exc:
            return Response({'detail': exc.detail}, status=status.HTTP_400_BAD_REQUEST)

        history = EmotionDetectionHistory.objects.create(
            user=request.user,
            detected_emotion=result['emotion'],
            mapped_mood=result['mapped_mood'],
            confidence=result['confidence'],
        )

        return Response(EmotionDetectionResponseSerializer(history).data, status=status.HTTP_200_OK)
