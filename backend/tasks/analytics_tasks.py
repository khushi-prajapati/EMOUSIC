import logging
from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from analytics.models import AnalyticsSnapshot
from analytics.services import build_analytics_payload

logger = logging.getLogger(__name__)


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={'max_retries': 3})
def generate_analytics_snapshot(self):
    payload = build_analytics_payload()
    snapshot = AnalyticsSnapshot.objects.create(metrics=payload)
    logger.info('Generated analytics snapshot %s', snapshot.id)
    return snapshot.id


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={'max_retries': 3})
def cleanup_old_analytics_snapshots(self, days=90):
    cutoff = timezone.now() - timedelta(days=days)
    deleted_count, _ = AnalyticsSnapshot.objects.filter(created_at__lt=cutoff).delete()
    logger.info('Deleted %s old analytics snapshots', deleted_count)
    return deleted_count
