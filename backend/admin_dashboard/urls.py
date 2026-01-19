from django.urls import path
from .views import AdminStatsView

app_name = 'admin_dashboard'

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
]
