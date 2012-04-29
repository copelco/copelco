from copelco.settings.staging import *

# There should be only minor differences from staging

DATABASES['default']['NAME'] = 'copelco_production'

EMAIL_SUBJECT_PREFIX = '[Copelco Prod] '

