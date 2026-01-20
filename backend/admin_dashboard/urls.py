from django.urls import path
from .views import (
    AdminStatsView,
    AdminCategoryListCreateView,
    AdminCategoryDetailView,
    AdminSubCategoryListCreateView,
    AdminSubCategoryDetailView
)

app_name = 'admin_dashboard'

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    
    # Category Management
    path('categories/', AdminCategoryListCreateView.as_view(), name='admin-categories'),
    path('categories/<int:pk>/', AdminCategoryDetailView.as_view(), name='admin-category-detail'),
    
    # SubCategory Management
    path('subcategories/', AdminSubCategoryListCreateView.as_view(), name='admin-subcategories'),
    path('subcategories/<int:pk>/', AdminSubCategoryDetailView.as_view(), name='admin-subcategory-detail'),
]
