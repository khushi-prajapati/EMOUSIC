from rest_framework import serializers

from .models import EmotionDetectionHistory


class EmotionDetectionRequestSerializer(serializers.Serializer):
    image = serializers.CharField(
        trim_whitespace=False,
        write_only=True,
        help_text='Base64 encoded image data or a browser data URL.',
    )


class EmotionDetectionResponseSerializer(serializers.ModelSerializer):
    emotion = serializers.CharField(source='detected_emotion')
    confidence = serializers.FloatField()

    class Meta:
        model = EmotionDetectionHistory
        fields = ('emotion', 'confidence', 'mapped_mood', 'created_at')
        read_only_fields = fields
