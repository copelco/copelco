from copelco.settings.base import *

DEBUG = True
TEMPLATE_DEBUG = DEBUG

# MIDDLEWARE_CLASSES += (
#     'debug_toolbar.middleware.DebugToolbarMiddleware',
# )

# INSTALLED_APPS += (
#     'debug_toolbar',
# )

INTERNAL_IPS = ('127.0.0.1', )

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

DEBUG_TOOLBAR_CONFIG = {
    'INTERCEPT_REDIRECTS': False
}

SOUTH_TESTS_MIGRATE = True

CELERY_ALWAYS_EAGER = True
    
COMPRESS_ENABLED = False
