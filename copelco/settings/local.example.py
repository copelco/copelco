import sys

from copelco.settings.dev import *

# Override settings here

# Special test settings
if 'test' in sys.argv:
    CELERY_ALWAYS_EAGER = True

    COMPRESS_ENABLED = False

    PASSWORD_HASHERS = (
        'django.contrib.auth.hashers.MD5PasswordHasher',
    )
