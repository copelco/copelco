from copelco.settings.base import *

DEBUG = False
TEMPLATE_DEBUG = DEBUG

DATABASES['default']['NAME'] = 'copelco_staging'

INSTALLED_APPS += (
    'gunicorn',
)

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': '127.0.0.1:11211',
    }
}

EMAIL_SUBJECT_PREFIX = '[Copelco Staging] '

COMPRESS_ENABLED = True
