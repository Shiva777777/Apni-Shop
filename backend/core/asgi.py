"""
ASGI config for Apni Shop project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os
import sys

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Add 'apps' directory to Python path
apps_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'apps')
if apps_dir not in sys.path:
    sys.path.insert(0, apps_dir)

application = get_asgi_application()
