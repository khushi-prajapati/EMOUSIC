import base64
import time

import requests
from django.conf import settings
from django.core.cache import cache
from django.core.cache.backends.base import InvalidCacheBackendError
from rest_framework import status
from rest_framework.exceptions import APIException


class SpotifyConfigurationError(APIException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_detail = 'Spotify API credentials are not configured.'
    default_code = 'spotify_credentials_missing'


class SpotifyServiceError(APIException):
    status_code = status.HTTP_502_BAD_GATEWAY
    default_detail = 'Unable to fetch data from Spotify.'
    default_code = 'spotify_service_error'


class SpotifyService:
    TOKEN_URL = 'https://accounts.spotify.com/api/token'
    SEARCH_URL = 'https://api.spotify.com/v1/search'

    def __init__(self, client_id=None, client_secret=None):
        self.client_id = client_id or settings.SPOTIFY_CLIENT_ID
        self.client_secret = client_secret or settings.SPOTIFY_CLIENT_SECRET

    def search_tracks(self, query, limit=10):
        params = {
            'q': query,
            'type': 'track',
            'limit': limit,
        }
        try:
            response = requests.get(
                self.SEARCH_URL,
                params=params,
                headers={'Authorization': f'Bearer {self._access_token()}'},
                timeout=10,
            )
            response.raise_for_status()
        except requests.RequestException as exc:
            raise SpotifyServiceError(str(exc)) from exc

        return [self._parse_track(item) for item in response.json().get('tracks', {}).get('items', [])]

    def _access_token(self):
        if not self.client_id or not self.client_secret:
            raise SpotifyConfigurationError()

        cache_key = 'spotify_client_credentials_token'
        cached_token = self._cache_get(cache_key)
        if cached_token:
            return cached_token

        token = base64.b64encode(f'{self.client_id}:{self.client_secret}'.encode()).decode()
        try:
            response = requests.post(
                self.TOKEN_URL,
                data={'grant_type': 'client_credentials'},
                headers={'Authorization': f'Basic {token}'},
                timeout=10,
            )
            response.raise_for_status()
        except requests.RequestException as exc:
            raise SpotifyServiceError(str(exc)) from exc

        payload = response.json()
        expires_in = max(int(payload.get('expires_in', 3600)) - 60, 60)
        access_token = payload['access_token']
        self._cache_set(cache_key, access_token, timeout=expires_in)
        return access_token

    def _parse_track(self, item):
        album_images = item.get('album', {}).get('images', [])
        return {
            'id': item.get('id'),
            'title': item.get('name'),
            'artists': [artist.get('name') for artist in item.get('artists', [])],
            'album': item.get('album', {}).get('name', ''),
            'preview_url': item.get('preview_url'),
            'spotify_url': item.get('external_urls', {}).get('spotify'),
            'image_url': album_images[0]['url'] if album_images else '',
            'popularity': item.get('popularity', 0),
            'duration_ms': item.get('duration_ms', 0),
            'fetched_at': int(time.time()),
        }

    def _cache_get(self, key):
        try:
            return cache.get(key)
        except Exception:
            return None

    def _cache_set(self, key, value, timeout):
        try:
            cache.set(key, value, timeout=timeout)
        except (Exception, InvalidCacheBackendError):
            return
